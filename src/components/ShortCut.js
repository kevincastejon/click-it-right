import React, { useState } from 'react';
import { shell } from 'electron';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton, Typography, ExpansionPanelActions, Divider, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, ClickAwayListener, Tooltip,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import GitHubIcon from '@material-ui/icons/GitHub';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FolderIcon from '@material-ui/icons/Folder';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import noicon from '../assets/img/noicon.png';

const useStyles = makeStyles(() => ({
  panel: {
    marginTop: 20,
    backgroundColor: '#fafdff',
  },
  avatar: {
    verticalAlign: 'bottom',
    marginRight: 10,
  },
}));


export default function ShortCut(props) {
  const {
    type, icon, name, label, description, command, dirEnv, dirBkgEnv, fileEnv, deskEnv, onEdit, onDelete, onInstall, onReplace, owned, authenticated, onPublish,
  } = props;
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();
  return (
    <ClickAwayListener onClickAway={() => setExpanded(false)}>
      <ExpansionPanel
        expanded={expanded}
        className={classes.panel}
        onChange={(e, exp) => {
          setExpanded(exp);
        }}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-label="Expand"
          aria-controls="additional-actions1-content"
          id="additional-actions1-header"
        >
          <div>
            <div>
              <Typography gutterBottom variant="h5" component="h2">
                <img className={classes.avatar} height={48} alt="icon" src={icon || noicon} />
                {name}
              </Typography>
            </div>
            <div style={{ marginLeft: 15 }}>
              <Typography variant="body2" color="textSecondary" component="p" style={{ lineHeight: '20px' }}>
                <label style={{
                  display: 'inline-block', width: 110, fontWeight: 'bold', textDecoration: 'underline',
                }}
                >
                  Label:
                  {' '}
                </label>
                <span>
                  {label}
                </span>
                <br />
                <label style={{
                  display: 'inline-block', width: 110, fontWeight: 'bold', textDecoration: 'underline',
                }}
                >
                  Command:
                  {' '}
                </label>
                <span title={command}>{`${command}`}</span>
                <br />
                <label style={{
                  display: 'inline-block', width: 110, fontWeight: 'bold', textDecoration: 'underline',
                }}
                >
                  Environments:
                  {' '}
                </label>
                {!dirEnv ? null : <span style={{ marginLeft: 0 }} title="Directory"><FolderIcon style={{ verticalAlign: 'bottom' }} /></span>}
                {!dirBkgEnv ? null : <span style={{ marginLeft: 10 }} title="Directory background"><PermMediaIcon style={{ verticalAlign: 'bottom' }} /></span>}
                {!fileEnv ? null : <span style={{ marginLeft: 10 }} title="Files"><FileCopyIcon style={{ verticalAlign: 'bottom' }} /></span>}
                {!deskEnv ? null : <span style={{ marginLeft: 10 }} title="Desktop"><DesktopWindowsIcon style={{ verticalAlign: 'bottom' }} /></span>}
                <br />
                {expanded ? null : (
                  <span>
                    <label style={{
                      display: 'inline-block', width: 110, fontWeight: 'bold', textDecoration: 'underline',
                    }}
                    >
                      Description:
                      {' '}
                    </label>
                    <span>{description ? `${description.substring(0, 50)}${description.length >= 50 ? '...' : ''}` : 'No description'}</span>
                  </span>
                )}
              </Typography>
            </div>

          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div style={{ marginLeft: 15 }}>
            <Typography variant="body2" color="textSecondary" component="p" style={{ lineHeight: '20px' }}>
              <label style={{
                display: 'inline-block', width: 110, fontWeight: 'bold', textDecoration: 'underline',
              }}
              >
                Description:
                {' '}
              </label>
              <span>{`${description || 'No description'}`}</span>
            </Typography>
          </div>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          {type === 'commu' ? null : (
            <Tooltip title={!authenticated ? 'Sign in to submit' : (description.length === 0 || !icon ? 'Description and icon are required to publish' : '')}>
              <span>
                <IconButton
                  disabled={!authenticated || description.length === 0 || !icon}
                  title="Publish"
                  onClick={() => onPublish()}
                >
                  <CloudUploadIcon />
                </IconButton>
              </span>
            </Tooltip>

          )}
          <IconButton
            title={type === 'own' ? 'Edit' : 'See on GitHub'}
            color={type === 'own' ? 'primary' : 'inherit'}
            onClick={() => {
              if (type === 'own') {
                onEdit();
              } else {
                shell.openExternal(`https://github.com/click-it-right-community/community-shortcuts/blob/master/shortcuts/${name}.json`);
              }
            }}
          >
            {type === 'own' ? <EditIcon /> : <GitHubIcon />}
          </IconButton>
          {!(type === 'commu' && owned) ? null : (
            <Typography variant="caption" color="error">
              You already own a shortcut with the same name!
            </Typography>
          )}
          <IconButton
            title={type === 'own' ? 'Delete' : (owned ? 'Replace' : 'Install')}
            color={(type === 'own' || (type === 'commu' && owned)) ? 'secondary' : 'primary'}
            onClick={() => {
              if (type === 'own') {
                onDelete();
              } else if (owned) {
                onReplace();
              } else {
                onInstall();
              }
            }}
          >
            {type === 'own' ? <DeleteIcon /> : <SystemUpdateAltIcon />}
          </IconButton>
        </ExpansionPanelActions>
      </ExpansionPanel>
    </ClickAwayListener>
  );
}
ShortCut.propTypes = {
  authenticated: PropTypes.bool,
  type: PropTypes.string,
  icon: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  command: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  dirEnv: PropTypes.bool.isRequired,
  dirBkgEnv: PropTypes.bool.isRequired,
  fileEnv: PropTypes.bool.isRequired,
  deskEnv: PropTypes.bool.isRequired,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onInstall: PropTypes.func,
  onReplace: PropTypes.func,
  onPublish: PropTypes.func,
  owned: PropTypes.bool,
};
ShortCut.defaultProps = {
  authenticated: false,
  type: 'own',
  icon: null,
  owned: false,
  onEdit: null,
  onDelete: null,
  onInstall: null,
  onReplace: null,
  onPublish: null,
};
