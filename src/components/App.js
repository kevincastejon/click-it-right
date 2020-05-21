import { ipcRenderer } from 'electron';
import '../assets/css/App.css';
import React, { useState, useEffect } from 'react';
import { CircularProgress, Backdrop } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Octokit } from '@octokit/rest';
import getGitContent from '../utils/getGitContent';
import OwnShortcuts from './OwnShortcuts';
import CommunityShortcuts from './CommunityShortcuts';
import ShortcutDialog from './ShortcutDialog';
import ShortCutModal from './ShortCutModal';
import PublishModal from './PublishModal';
import LayoutMenu from './LayoutMenu';
import Notifier from './Notifier';

const gitSteps = [
  { label: 'Authenticating', labelAfter: 'Authenticated' },
  { label: 'Retrieving user info', labelAfter: 'Retrieved user info' },
  { label: 'Creating a fork', labelAfter: 'Created a fork' },
  { label: 'Retrieving base info', labelAfter: 'Retrieved base info' },
  { label: 'Creating a branch', labelAfter: 'Created a branch' },
  { label: 'Checking existing file', labelAfter: 'Checked existing file' },
  { label: 'Committing new file', labelAfter: 'Committed new file' },
  { label: 'Creating a pull request', labelAfter: 'Created a pull request' },
];

const useStyles = makeStyles((theme) => ({
  root: {
  },
  bodyCont: {
    margin: 'auto',
    minWidth: 725,
    maxWidth: 1000,
    paddingLeft: 50,
    paddingRight: 50,
    marginTop: 85,
    marginBottom: 115,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function App() {
  const [notification, setNotification] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [page, setPage] = useState('own');
  const [ownShortcuts, setOwnShortcuts] = useState(null);
  const [commuShortcuts, setCommuShortcuts] = useState(null);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [installingId, setInstallingId] = useState(null);
  const [frozen, setFrozen] = useState(false);
  const [loadingOwn, setLoadingOwn] = useState(false);
  const [loadingCommu, setLoadingCommu] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [currentGitStep, setCurrentGitStep] = useState(-1);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const classes = useStyles();

  const getOwnShortcuts = () => {
    setLoadingOwn(true);
    setOwnShortcuts(null);
    ipcRenderer.once('onKeys', (e, ks) => {
      setOwnShortcuts(ks);
      setLoadingOwn(false);
    });
    ipcRenderer.send('getKeys');
  };
  const getCommuShortcuts = async () => {
    setLoadingCommu(true);
    setCommuShortcuts(null);
    let shortcuts;
    try {
      const files = (await getGitContent('shortcuts/')).body;
      shortcuts = await Promise.all(files.map(async (f) => JSON.parse(Buffer.from((await getGitContent(`shortcuts/${f.name}`)).body.content, 'base64'))));
      setCommuShortcuts(shortcuts);
      setLoadingCommu(false);
    } catch (e) {
      setNotification({ type: 'error', message: e.message });
    }
  };
  const createShortcut = (key) => {
    setFrozen(true);
    setAdding(false);
    ipcRenderer.once('keyAdded', () => {
      setNotification({ type: 'success', message: 'Shortcut created!' });
      setFrozen(false);
      getOwnShortcuts();
    });
    ipcRenderer.send('addKey', key);
  };
  const installShortcut = (key) => {
    setFrozen(true);
    setInstallingId(null);
    ipcRenderer.once('keyAdded', () => {
      setNotification({ type: 'success', message: 'Shortcut installed!' });
      setFrozen(false);
      getOwnShortcuts();
    });
    ipcRenderer.send('addKey', key);
  };
  const replaceShortcut = (key, oldkey) => {
    setFrozen(true);
    setInstallingId(null);
    ipcRenderer.once('keyEdited', () => {
      setNotification({ type: 'success', message: 'Shortcut replaced!' });
      setFrozen(false);
      getOwnShortcuts();
    });
    ipcRenderer.send('editKey', key, oldkey);
  };
  const editShortcut = (key, oldkey) => {
    setFrozen(true);
    setEditingId(null);
    ipcRenderer.once('keyEdited', () => {
      setNotification({ type: 'success', message: 'Shortcut edited!' });
      setFrozen(false);
      getOwnShortcuts();
    });
    ipcRenderer.send('editKey', key, oldkey);
  };
  const deleteShortcut = (key) => {
    setFrozen(true);
    setDeletingId(null);
    ipcRenderer.once('keyDeleted', () => {
      setNotification({ type: 'success', message: 'Shortcut deleted!' });
      setFrozen(false);
      getOwnShortcuts();
    });
    ipcRenderer.send('deleteKey', key);
  };
  const authenticate = () => {
    ipcRenderer.once('onToken', async (e, token) => {
      localStorage.setItem('click-it-right-token', token);
      const octokit = new Octokit({
        auth: token,
      });
      setAvatarUrl((await octokit.request('/user')).data.avatar_url);
      setAuthenticated(true);
    });
    ipcRenderer.send('getToken');
  };
  const deleteToken = () => {
    localStorage.removeItem('click-it-right-token');
    setAvatarUrl(null);
    setAuthenticated(false);
  };
  const changePage = (_page) => {
    if (_page === 'own') {
      getOwnShortcuts();
    } else {
      getOwnShortcuts();
      getCommuShortcuts();
    }
    setPage(_page);
  };
  const publishShortcut = async (shortcut) => {
    // Authenticating
    setCurrentGitStep(0);
    const octokit = new Octokit({
      auth: localStorage.getItem('click-it-right-token'),
    });
    setCurrentGitStep(1);
    // Retrieving user info
    const { login } = (await octokit.request('/user')).data;
    const ownRepo = {
      owner: login,
      repo: 'community-shortcuts',
    };
    const commuRepo = {
      owner: 'click-it-right-community',
      repo: 'community-shortcuts',
    };
    setCurrentGitStep(2);
    // Creating fork
    await octokit.repos.createFork({
      ...commuRepo,
    });
    setCurrentGitStep(3);
    // Retrieving upstream info
    const shaOrigin = (await octokit.git.getRef({
      ...commuRepo,
      ref: 'heads/master',
    })).data.object.sha;
    setCurrentGitStep(4);
    // Creating a branch
    try {
      await octokit.git.createRef({
        ...ownRepo,
        ref: `refs/heads/${shortcut.name}`,
        sha: shaOrigin,
      });
    } catch (e) {
      // console.log('branch already exists!');
    }
    setCurrentGitStep(5);
    // Checking existing file
    let existingSha = null;
    try {
      existingSha = (await octokit.repos.getContents({
        ...ownRepo,
        path: `shortcuts/${shortcut.name}.json`,
        ref: shortcut.name,
      })).data.sha;
    } catch (e) {
      // console.log('No existing file');
    }
    const shaObj = {};
    if (existingSha) {
      shaObj.sha = existingSha;
    }
    setCurrentGitStep(6);
    // Commiting file
    await octokit.repos.createOrUpdateFile({
      ...ownRepo,
      path: `shortcuts/${shortcut.name}.json`,
      message: `Shortcut proposal from click-it-right app : ${shortcut.name}`,
      content: Buffer.from(JSON.stringify(shortcut, null, 2)).toString('base64'),
      ...shaObj,
      branch: shortcut.name,
    });
    setCurrentGitStep(7);
    // Creating pull request
    try {
      await octokit.pulls.create({
        ...commuRepo,
        title: `Shortcut proposal from click-it-right app : ${shortcut.name}`,
        base: 'master',
        head: `${login}:${shortcut.name}`,
      });
      // console.log('pull request created');
    } catch (e) {
      if (e.message.includes('A pull request already exists')) {
        // console.log('Pull request already exists!');
        // console.log('Pull request updated');
      } else {
        console.log(e);
      }
    }
    setCurrentGitStep(8);
    setNotification({ type: 'success', message: 'Shortcut submitted!' });
    setPublishing(false);
    getOwnShortcuts();
    getCommuShortcuts();
    setCurrentGitStep(-1);
  };

  useEffect(() => {
    ipcRenderer.on('error', (e, error) => {
      setNotification({ type: 'error', message: error });
    });
    if (page === 'own') {
      getOwnShortcuts();
    } else {
      getOwnShortcuts();
      getCommuShortcuts();
    }
    const token = localStorage.getItem('click-it-right-token');
    if (token) {
      const octokit = new Octokit({
        auth: token,
      });
      octokit.request('/user').then((res) => {
        setAvatarUrl(res.data.avatar_url);
        setAuthenticated(true);
      });
    } else {
      setAvatarUrl(null);
      setAuthenticated(false);
    }
    return (() => {
      ipcRenderer.removeAllListeners();
    });
  }, []);
  return (
    <div className={classes.root}>
      <LayoutMenu
        authenticated={authenticated}
        avatarUrl={avatarUrl}
        loading={loadingOwn}
        page={page}
        onSignIn={() => authenticate()}
        onLogOut={() => deleteToken()}
        onPageChange={(val) => changePage(val)}
        onPublish={() => setPublishing(true)}
      />
      <div>
        <ShortCutModal
          shortcuts={ownShortcuts}
          editingId={editingId}
          open={editingId != null || adding}
          onSubmit={(k, oldK) => {
            if (editingId) {
              editShortcut(k, oldK);
            } else {
              createShortcut(k);
            }
          }}
          onCancel={() => {
            setAdding(false);
            setEditingId(null);
          }}
        />
        <PublishModal
          shortcuts={ownShortcuts}
          open={publishing}
          gitSteps={gitSteps}
          currentGitStep={currentGitStep}
          onSubmit={(name) => {
            publishShortcut(ownShortcuts.find((osc) => osc.name === name));
          }}
          onCancel={() => {
            if (currentGitStep === -1) {
              setPublishing(false);
            }
          }}
        />
        <ShortcutDialog
          type={deletingId ? 'delete' : (ownShortcuts && ownShortcuts.find((sc) => sc.name === installingId) ? 'replace' : 'install')}
          open={deletingId !== null || installingId !== null}
          name={deletingId || installingId ? deletingId || installingId : ''}
          onSubmit={() => {
            if (deletingId) {
              deleteShortcut(ownShortcuts.find((osc) => osc.name === deletingId));
            } else {
              const ownShortcut = ownShortcuts.find((sc) => sc.name === installingId);
              if (ownShortcut) {
                replaceShortcut(commuShortcuts.find((csc) => csc.name === installingId), ownShortcut);
              } else {
                installShortcut(commuShortcuts.find((csc) => csc.name === installingId));
              }
            }
          }}
          onCancel={() => { setDeletingId(null); setInstallingId(null); }}
        />
      </div>
      <Backdrop className={classes.backdrop} open={frozen}>
        <CircularProgress color="inherit" style={{ marginRight: 10 }} />
        Operating...
      </Backdrop>
      <Notifier
        notification={notification}
        onClose={() => setNotification(null)}
      />
      <div className={classes.bodyCont}>
        {page === 'own' ? (
          <OwnShortcuts
            loading={loadingOwn}
            shortcuts={ownShortcuts}
            onCreate={() => setAdding(true)}
            onEdit={(name) => setEditingId(name)}
            onDelete={(name) => setDeletingId(name)}
          />
        ) : (
          <CommunityShortcuts
            loading={loadingOwn || loadingCommu}
            authenticated={authenticated}
            ownShortcuts={ownShortcuts}
            commuShortcuts={commuShortcuts}
            onInstall={(name) => {
              setInstallingId(name);
            }}
            onReplace={(name) => {
              setInstallingId(name);
            }}
            onPublish={() => {
              setPublishing(true);
            }}
          />
        )}
      </div>
    </div>
  );
}
