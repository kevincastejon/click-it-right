import { ipcRenderer } from 'electron';
import '../assets/css/App.css';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
} from '@material-ui/core';
import KeysPanel from './KeysPanel';
//
const types = ['dir',
  'dirBkg',
  'file',
  'desk'];
const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'center',
    minWidth: '600px',
  },
  tabsCont: {
    backgroundColor: 'white',
    position: 'fixed',
    top: '0',
    width: '100%',
    zIndex: 999,
    minWidth: '600px',
  },
  bodyCont: {
    marginTop: 120,
  },
}));

export default function App() {
  const [error, setError] = useState(null);
  useEffect(() => {
    // App system menu callbacks
    ipcRenderer.on('open', () => {
      console.log('open from menu');
    });
    ipcRenderer.on('onError', (e, err) => {
      setError(err);
    });
    // Main processes callbacks
    // ipcRenderer.on('onKeyList', (e, keys) => {
    //   setDirKeys(keys.dirKeys);
    //   setDirBkgKeys(keys.dirBkgKeys);
    //   setFileKeys(keys.fileKeys);
    //   setDesktopKeys(keys.desktopKeys);
    // });
    // ipcRenderer.send('getKeyList');
    return (() => {
      ipcRenderer.removeAllListeners();
    });
  }, []);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h1>{!error ? null : error}</h1>
      <div className={classes.tabsCont}>
        <Typography variant="h3">
          Registry Context Manager
        </Typography>
      </div>
      <div className={classes.bodyCont}>
        <KeysPanel />
      </div>
    </div>
  );
}
