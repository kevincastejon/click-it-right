import '../assets/css/App.css';
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button, TextField, Typography, Tooltip, Switch, FormGroup, FormControlLabel,
} from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import HelpIcon from '@material-ui/icons/Help';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '600px',
    textAlign: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  fieldsCont: {
    textAlign: 'left',
    marginBottom: 20,
    marginTop: 20,
  },
  toolTip: {
    verticalAlign: 'bottom',
    color: 'grey',
  },
  iconHolder: {
    width: 64,
    height: 64,
    border: '1px solid black',
  },
}));


export default function ShortCutForm(props) {
  const {
    type, icon, name, label, command, description, existingNames, onCancel, onSubmit, dirEnv, dirBkgEnv, fileEnv, deskEnv,
  } = props;
  const [picon, setPicon] = useState(icon);
  const [pname, setPname] = useState(name);
  const [plabel, setPlabel] = useState(label);
  const [pcommand, setPcommand] = useState(command);
  const [pdescription, setPdescription] = useState(description);
  const [pdirEnv, setPdirEnv] = useState(dirEnv);
  const [pdirBkgEnv, setPdirBkgEnv] = useState(dirBkgEnv);
  const [pfileEnv, setPfileEnv] = useState(fileEnv);
  const [pdeskEnv, setPdeskEnv] = useState(deskEnv);
  const inputEl = useRef(null);
  const classes = useStyles();
  const nameError = pname.length && ((existingNames.includes(pname) && pname !== name)) ? 'This name is already used by another shortcut!' : null;
  return (
    <div className={classes.root}>
      <input
        ref={inputEl}
        style={{
          display: 'none',
        }}
        id="file-button"
        type="file"
        accept="image/x-icon"
        onChange={(e) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            setPicon(ev.target.result);
          };
          reader.readAsDataURL(e.target.files[0]);
          e.target.value = '';
        }}
      />
      <div className={classes.paper}>
        <Typography variant="h4">
          {type === 'add' ? 'New shortcut' : 'Edit shortcut'}
        </Typography>
        <div className={classes.fieldsCont}>
          <div
            style={{ display: 'inline-block' }}
            onClick={() => inputEl.current.click()}
            className={classes.iconHolder}
          >
            {!picon ? null : <img height={64} alt="icon" src={picon} />}
          </div>
          <Button
            onClick={() => inputEl.current.click()}
            style={{ verticalAlign: 'bottom', marginLeft: 10 }}
          >
            Select icon (64x64)
          </Button>
          <div>
            <TextField
              onChange={(e) => setPname(e.target.value.trim().replace(/[^a-zA-Z0-9_]/g, ''))}
              required
              placeholder="Enter a context menu label"
              label="Name"
              value={pname}
              error={nameError !== null}
              helperText={nameError}
            />
            <Tooltip className={classes.toolTip} title="Unique name for your shortcut" aria-label="name">
              <HelpIcon fontSize="small" />
            </Tooltip>
          </div>
          <div>
            <TextField
              label="Label"
              style={{ marginTop: 10, width: 300 }}
              onChange={(e) => setPlabel(e.target.value.trimStart().replace(/[^a-zA-Z0-9 ]/g, ''))}
              required
              placeholder="Enter a context menu label"
              value={plabel}
            />
            <Tooltip className={classes.toolTip} title="Label displayed on the right-click context menu" aria-label="label">
              <HelpIcon fontSize="small" />
            </Tooltip>
          </div>
          <div>
            <TextField
              label="Command"
              style={{ marginTop: 10, width: 500 }}
              onChange={(e) => setPcommand(e.target.value.trim())}
              required
              placeholder="Enter a command"
              value={pcommand}
            />
            <Tooltip className={classes.toolTip} title={'Command called when the shortcut is clicked. Each block of commands / arguments should be double-quoted. Example: "path/to/app.exe" "arg1" "arg2"...'} aria-label="label">
              <HelpIcon fontSize="small" />
            </Tooltip>
          </div>
          <div>
            <TextField
              label="Description"
              style={{ marginTop: 10, width: 500 }}
              onChange={(e) => setPdescription(e.target.value.trim())}
              placeholder="Enter a description"
              value={pdescription}
            />
            <Tooltip className={classes.toolTip} title="Description for your shortcut" aria-label="label">
              <HelpIcon fontSize="small" />
            </Tooltip>
          </div>
          <Typography style={{ marginTop: 20 }}>
            Environments
          </Typography>
          <div>
            <FormGroup>
              <FormControlLabel
                control={(
                  <Switch
                    checked={pdirEnv}
                    onChange={() => {
                      if (pdirEnv) {
                        if (pdirBkgEnv || pfileEnv || pdeskEnv) {
                          setPdirEnv(false);
                        }
                      } else {
                        setPdirEnv(true);
                      }
                    }}
                    color="primary"
                  />
            )}
                label={(
                  <span style={{ color: !pdirEnv ? 'grey' : 'blue' }}>
                    <FolderIcon style={{ verticalAlign: 'bottom' }} />
                    {' '}
                    Directory
                    {' '}
                    <Tooltip style={{ verticalAlign: 'bottom' }} className={classes.toolTip} title="Right-click on a directory item" aria-label="name">
                      <HelpIcon fontSize="small" />
                    </Tooltip>
                  </span>
)}
              />
              <FormControlLabel
                control={(
                  <Switch
                    checked={pdirBkgEnv}
                    onChange={() => {
                      if (pdirBkgEnv) {
                        if (pdirEnv || pfileEnv || pdeskEnv) {
                          setPdirBkgEnv(false);
                        }
                      } else {
                        setPdirBkgEnv(true);
                      }
                    }}
                    color="primary"
                  />
              )}
                label={(
                  <span style={{ color: !pdirBkgEnv ? 'grey' : 'blue' }}>
                    <PermMediaIcon style={{ verticalAlign: 'bottom' }} />
                    {' '}
                    Directory background
                    {' '}
                    <Tooltip style={{ verticalAlign: 'bottom' }} className={classes.toolTip} title="Right-click on a directory background" aria-label="name">
                      <HelpIcon fontSize="small" />
                    </Tooltip>
                  </span>
)}
              />
              <FormControlLabel
                control={(
                  <Switch
                    checked={pfileEnv}
                    onChange={() => {
                      if (pfileEnv) {
                        if (pdirEnv || pdirBkgEnv || pdeskEnv) {
                          setPfileEnv(false);
                        }
                      } else {
                        setPfileEnv(true);
                      }
                    }}
                    color="primary"
                  />
              )}
                label={(
                  <span style={{ color: !pfileEnv ? 'grey' : 'blue' }}>
                    <FileCopyIcon style={{ verticalAlign: 'bottom' }} />
                    {' '}
                    Files
                    {' '}
                    <Tooltip style={{ verticalAlign: 'bottom' }} className={classes.toolTip} title="Right-click on a file item" aria-label="name">
                      <HelpIcon fontSize="small" />
                    </Tooltip>
                  </span>
)}
              />
              <FormControlLabel
                control={(
                  <Switch
                    checked={pdeskEnv}
                    onChange={() => {
                      if (pdeskEnv) {
                        if (pdirEnv || pdirBkgEnv || pfileEnv) {
                          setPdeskEnv(false);
                        }
                      } else {
                        setPdeskEnv(true);
                      }
                    }}
                    color="primary"
                  />
              )}
                label={(
                  <span style={{ color: !pdeskEnv ? 'grey' : 'blue' }}>
                    <DesktopWindowsIcon style={{ verticalAlign: 'bottom' }} />
                    {' '}
                    Desktop
                    {' '}
                    <Tooltip style={{ verticalAlign: 'bottom' }} className={classes.toolTip} title="Right-click on the desktop" aria-label="name">
                      <HelpIcon fontSize="small" />
                    </Tooltip>
                  </span>
)}
              />
            </FormGroup>
          </div>
        </div>
        <Button
          color="primary"
          onClick={() => {
            onSubmit({
              icon: picon, name: pname, label: plabel.trimEnd(), command: pcommand, description: pdescription, dirEnv: pdirEnv, dirBkgEnv: pdirBkgEnv, fileEnv: pfileEnv, deskEnv: pdeskEnv,
            });
          }}
          variant="contained"
          disabled={((existingNames.includes(pname) && pname !== name) || pname === '') || (plabel === '') || (pcommand === '')}
        >
          {type === 'add' ? 'Create' : 'Edit'}
        </Button>
        {' '}
        <Button
          onClick={() => {
            onCancel();
          }}
          variant="contained"
          color="secondary"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
ShortCutForm.propTypes = {
  type: PropTypes.string.isRequired,
  icon: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  command: PropTypes.string,
  description: PropTypes.string,
  existingNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  dirEnv: PropTypes.bool,
  dirBkgEnv: PropTypes.bool,
  fileEnv: PropTypes.bool,
  deskEnv: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
ShortCutForm.defaultProps = {
  icon: null,
  name: '',
  label: '',
  command: '',
  description: '',
  dirEnv: true,
  dirBkgEnv: false,
  fileEnv: false,
  deskEnv: false,
};
