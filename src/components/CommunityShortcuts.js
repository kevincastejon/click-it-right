import { ipcRenderer } from 'electron';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress, Button, Backdrop, Typography, Tooltip,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import superagent from 'superagent';
import SearchBar from './SearchBar';
// import ShortCutForm from './ShortCutForm';
import ShortCut from './ShortCut';

// const { Octokit } = require('@octokit/rest');

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'left',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const getGitContent = async (path, params = {}) => {
  const url = `https://api.github.com/repos/kevincastejon/community-shortcuts/contents/${path}`;
  return await superagent
    .get(url)
    .auth('5e7f0fb49300fe721034', 'bc06c610e243021b3773c8a92191c65585990a49')
    .set('Accept', 'application/json')
    .set(params)
    .send();
};

export default function CommunityShortcuts(props) {
  const {
    authenticated, onError, onNotif,
  } = props;
  const [keys, setKeys] = useState(null);
  const [ownKeys, setOwnKeys] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState([]);
  const [installingModal, setInstallingModal] = useState(-1);
  const [frozen, setFrozen] = useState(false);
  // const [loading, setLoading] = useState(false);
  ipcRenderer.on('onError', (e, err) => {
    onError(err);
  });
  const getData = async () => {
    // setLoading(true);
    setKeys(null);
    let shortcuts;
    try {
      const files = (await getGitContent('shortcuts/')).body;
      shortcuts = await Promise.all(files.map(async (f) => JSON.parse(Buffer.from((await getGitContent(`shortcuts/${f.name}`)).body.content, 'base64'))));
      ipcRenderer.send('getKeys');
    } catch (e) {
      onError(e);
    }
    ipcRenderer.once('onKeys', (e, ks) => {
      setOwnKeys(ks);
      setKeys(shortcuts);
      // setLoading(false);
    });
  };
  const addData = (key) => {
    setFrozen(true);
    setInstallingModal(-1);
    ipcRenderer.once('keyAdded', () => {
      onNotif('Shortcut installed!');
      setFrozen(false);
      getData();
    });
    ipcRenderer.send('addKey', key);
  };
  const editData = (oldkey, key) => {
    setFrozen(true);
    setInstallingModal(-1);
    ipcRenderer.once('keyEdited', () => {
      onNotif('Shortcut replaced!');
      setFrozen(false);
      getData();
    });
    ipcRenderer.send('editKey', oldkey, key);
  };
  useEffect(() => {
    getData();
    return (() => {
      ipcRenderer.removeAllListeners();
    });
  }, []);
  const filteredKeys = !keys ? null : (filters.length === 0 ? keys.concat() : keys.filter((k) => filters.find((ft) => k[`${ft}Env`])))
    .filter((k) => k.name.toLowerCase().includes(search.toLowerCase()));
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Backdrop className={classes.backdrop} open={frozen}>
        <CircularProgress color="inherit" style={{ marginRight: 10 }} />
        {' '}
        Installing shortcut...
      </Backdrop>
      {!keys ? null : (
        <div>
          <Dialog
            open={installingModal > -1}
            onClose={() => setInstallingModal(-1)}
          >
            <DialogTitle>
              Really
              {' '}
              {installingModal > -1 && ownKeys.map((k) => k.name).includes(keys[installingModal].name) ? 'replace' : 'install'}
              {' '}
              this shortcut?
              <p>
                <ArrowRightIcon style={{ verticalAlign: 'middle' }} />
                {installingModal > -1 ? keys[installingModal].name : null}
              </p>
            </DialogTitle>
            <DialogActions>
              <Button
                onClick={() => {
                  if (ownKeys.map((k) => k.name).includes(keys[installingModal].name)) {
                    editData(ownKeys.find((k) => k.name === keys[installingModal].name), keys[installingModal]);
                  } else {
                    addData(keys[installingModal]);
                  }
                }}
                color="primary"
              >
                OK
              </Button>
              <Button
                onClick={() => {
                  setInstallingModal(-1);
                }}
                color="secondary"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
      <div style={{ textAlign: 'right' }}>
        <Tooltip title="You have to sign in to publish">
          <span>
            <Button
              style={{ marginBottom: 15 }}
              disabled={!authenticated}
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={() => {
              // setAddingModal(true);
              }}
            >
              Publish a shortcut
            </Button>
          </span>
        </Tooltip>
      </div>
      <SearchBar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
        }}
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(newFilters);
        }}
      />
      {!keys ? (
        <Typography variant="h6" style={{ marginTop: 15 }}>
          <CircularProgress />
          {' '}
          Reading community shortcuts...
        </Typography>
      ) : !filteredKeys.length ? <h4>No shortcut</h4> : filteredKeys.map((k, i) => (
        <ShortCut
          owned={ownKeys.map((key) => key.name).includes(k.name)}
          type="commu"
          key={k.name}
          icon={k.icon}
          name={k.name}
          label={k.label}
          description={k.description}
          command={k.command}
          dirEnv={k.dirEnv}
          dirBkgEnv={k.dirBkgEnv}
          fileEnv={k.fileEnv}
          deskEnv={k.deskEnv}
          onReplace={() => {
            setInstallingModal(i);
          }}
          onInstall={() => {
            setInstallingModal(i);
          }}
        />
      ))}
    </div>
  );
}
CommunityShortcuts.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  onError: PropTypes.func.isRequired,
  onNotif: PropTypes.func.isRequired,
};
