import { ipcRenderer } from 'electron';
import '../assets/css/App.css';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MyShortcuts from './MyShortcuts';
import CommunityShortcuts from './CommunityShortcuts';
// import ShortCutForm from './ShortCutForm';
import LayoutMenu from './LayoutMenu';
import Notifier from './Notifier';

const useStyles = makeStyles(() => ({
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
}));

export default function App() {
  const [notification, setNotification] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [page, setPage] = useState('own');
  // const [publishingModal, setPublishingModal] = useState(false);
  const classes = useStyles();
  useEffect(() => {
    ipcRenderer.on('onToken', (e, token) => {
      localStorage.setItem('click-it-right-token', token);
      setAuthenticated(true);
    });
    const token = localStorage.getItem('click-it-right-token');
    if (token) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
    return (() => {
      ipcRenderer.removeAllListeners();
    });
  }, []);
  return (
    <div className={classes.root}>
      <LayoutMenu
        menuOpen={menuOpen}
        authenticated={authenticated}
        page={page}
        onSignIn={() => ipcRenderer.send('getToken')}
        onLogOut={() => { localStorage.removeItem('click-it-right-token'); setAuthenticated(false); }}
        onMenuChange={(val) => setMenuOpen(val)}
        onPageChange={(val) => setPage(val)}
      />
      <Notifier
        notification={notification}
        onClose={() => setNotification(null)}
      />
      <div className={classes.bodyCont}>
        {page === 'own' ? (
          <MyShortcuts
            onError={(err) => {
              setNotification({ type: 'error', message: err.message });
            }}
            onNotif={(message) => {
              setNotification({ type: 'success', message });
            }}
          />
        ) : (
          <CommunityShortcuts
            authenticated={authenticated}
            onError={(err) => {
              setNotification({ type: 'error', message: err.message });
            }}
            onNotif={(message) => {
              setNotification({ type: 'success', message });
            }}
          />
        )}
      </div>
    </div>
  );
}
