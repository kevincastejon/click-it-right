import { ipcRenderer } from 'electron';
import '../assets/css/App.css';
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Drawer, ListItemText, ListItemIcon, ListItem, List, AppBar, Toolbar, Typography, IconButton, Divider, Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import WorkIcon from '@material-ui/icons/Work';
import PublicIcon from '@material-ui/icons/Public';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MyShortcuts from './MyShortcuts';
import CommunityShortcuts from './CommunityShortcuts';
import logoTitle from '../assets/img/logo_title_small.png';
import logo from '../assets/img/logo.png';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'left',
    minWidth: '600px',
    marginLeft: 50,
    marginRight: 50,
  },
  bodyCont: {
    marginTop: 85,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: 240,
    width: `calc(100% - ${240}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 0,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: 240,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
  },
}));

const pages = {
  own: 'My shortcuts',
  commu: 'Community shortcuts',
};

export default function App() {
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState('own');
  useEffect(() => {
    ipcRenderer.on('onError', (e, err) => {
      setError(err);
    });
    return (() => {
      ipcRenderer.removeAllListeners();
    });
  }, []);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar
        color="default"
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: menuOpen,
        })}
      >
        <Toolbar>
          {page === 'own' ? <WorkIcon onClick={() => setMenuOpen(!menuOpen)} /> : <PublicIcon onClick={() => setMenuOpen(!menuOpen)} />}
          {menuOpen ? null : <Typography onClick={() => setMenuOpen(!menuOpen)} style={{ userSelect: 'none', marginRight: 10, marginLeft: 10 }} variant="h5">{pages[page]}</Typography>}
          <IconButton
            onClick={() => setMenuOpen(!menuOpen)}
            color="inherit"
            aria-label="open drawer"
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: menuOpen,
            })}
          >
            <ChevronRightIcon />
          </IconButton>
          <img style={{ marginLeft: 10 }} height={50} src={menuOpen ? logo : logoTitle} alt="logo" />
        </Toolbar>
      </AppBar>
      <Drawer
        onClose={() => setMenuOpen(false)}
        anchor="left"
        open={menuOpen}
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: menuOpen,
          [classes.drawerClose]: !menuOpen,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: menuOpen,
            [classes.drawerClose]: !menuOpen,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={() => setMenuOpen(false)} style={{ verticalAlign: 'middle' }}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem title="My shortcuts" button key="myShortcuts" onClick={() => { setMenuOpen(false); setPage('own'); }}>
            <ListItemIcon><WorkIcon /></ListItemIcon>
            <ListItemText primary="My shortcuts" />
          </ListItem>
          <ListItem title="Community shortcuts" button key="commuShortcuts" onClick={() => { setMenuOpen(false); setPage('commu'); }}>
            <ListItemIcon><PublicIcon /></ListItemIcon>
            <ListItemText primary="Community shortcuts" />
          </ListItem>
        </List>
      </Drawer>
      <div className={classes.bodyCont}>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={error !== null}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert
            onClose={() => setError(null)}
            severity="error"
          >
            {error}
          </Alert>
        </Snackbar>
        {page === 'own' ? <MyShortcuts /> : <CommunityShortcuts />}
      </div>
    </div>
  );
}
