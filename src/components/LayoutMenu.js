import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton, Typography, AppBar, Toolbar, Drawer, Divider, List, ListItem, ListItemText, ListItemIcon, Avatar,
} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import GitHubIcon from '@material-ui/icons/GitHub';
import WorkIcon from '@material-ui/icons/Work';
import PublicIcon from '@material-ui/icons/Public';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import pages from '../utils/pages';
import logoTitle from '../assets/img/logo_title_small.png';

const useStyles = makeStyles((theme) => ({
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

export default function LayoutMenu(props) {
  const {
    authenticated, avatarUrl, page, onPageChange, onSignIn, onLogOut, onPublish, loading,
  } = props;
  const [menuOpen, setMenuOpen] = useState(false);
  const classes = useStyles();
  return (
    <div>
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
          {!menuOpen ? <img style={{ marginLeft: 10 }} height={50} src={logoTitle} alt="logo" /> : null}
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
        <div className={classes.toolbar} onClick={() => setMenuOpen(false)}>
          <img style={{ marginRight: 20 }} height={50} src={logoTitle} alt="logo" />
          <IconButton style={{ verticalAlign: 'middle' }}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem title="My shortcuts" button key="myShortcuts" onClick={() => { setMenuOpen(false); onPageChange('own'); }}>
            <ListItemIcon><WorkIcon /></ListItemIcon>
            <ListItemText primary="My shortcuts" />
          </ListItem>
          <ListItem title="Community shortcuts" button key="commuShortcuts" onClick={() => { setMenuOpen(false); onPageChange('commu'); }}>
            <ListItemIcon><PublicIcon /></ListItemIcon>
            <ListItemText primary="Community shortcuts" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            title={authenticated ? 'Log out' : 'Sign in (required for proposing your own shortcuts to the community)'}
            button
            key="githubsignin"
            onClick={() => {
              if (authenticated) {
                onLogOut();
              } else {
                onSignIn();
              }
            }}
          >
            <ListItemIcon>{avatarUrl ? <Avatar style={{ height: 25, width: 25 }} alt="Github avatar" src={avatarUrl} /> : <GitHubIcon />}</ListItemIcon>
            <ListItemText primary={authenticated ? 'Log out' : 'Sign in'} />
          </ListItem>
          <ListItem
            disabled={!authenticated || loading}
            title={!authenticated ? 'You have to sign in first' : 'Publish a shortcut'}
            button
            key="publish"
            onClick={() => { setMenuOpen(false); onPublish(); }}
          >
            <ListItemIcon><CloudUploadIcon /></ListItemIcon>
            <ListItemText primary="Publish a shortcut" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}
LayoutMenu.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  avatarUrl: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  page: PropTypes.string.isRequired,
  onSignIn: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired,
};
LayoutMenu.defaultProps = {
  avatarUrl: null,
};
