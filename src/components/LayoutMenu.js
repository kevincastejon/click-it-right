import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton, Typography, AppBar, Toolbar, Drawer, Divider, List, ListItem, ListItemText, ListItemIcon,
} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import GitHubIcon from '@material-ui/icons/GitHub';
import WorkIcon from '@material-ui/icons/Work';
import PublicIcon from '@material-ui/icons/Public';
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
    menuOpen, authenticated, page, onMenuChange, onPageChange, onSignIn, onLogOut,
  } = props;
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
          {page === 'own' ? <WorkIcon onClick={() => onMenuChange(!menuOpen)} /> : <PublicIcon onClick={() => onMenuChange(!menuOpen)} />}
          {menuOpen ? null : <Typography onClick={() => onMenuChange(!menuOpen)} style={{ userSelect: 'none', marginRight: 10, marginLeft: 10 }} variant="h5">{pages[page]}</Typography>}
          <IconButton
            onClick={() => onMenuChange(!menuOpen)}
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
        onClose={() => onMenuChange(false)}
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
        <div className={classes.toolbar} onClick={() => onMenuChange(false)}>
          <img style={{ marginRight: 20 }} height={50} src={logoTitle} alt="logo" />
          <IconButton style={{ verticalAlign: 'middle' }}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem title="My shortcuts" button key="myShortcuts" onClick={() => { onMenuChange(false); onPageChange('own'); }}>
            <ListItemIcon><WorkIcon /></ListItemIcon>
            <ListItemText primary="My shortcuts" />
          </ListItem>
          <ListItem title="Community shortcuts" button key="commuShortcuts" onClick={() => { onMenuChange(false); onPageChange('commu'); }}>
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
            <ListItemIcon><GitHubIcon /></ListItemIcon>
            <ListItemText primary={authenticated ? 'Log out' : 'Sign in'} />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}
LayoutMenu.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  page: PropTypes.string.isRequired,
  onSignIn: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
  onMenuChange: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
