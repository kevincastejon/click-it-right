import '../assets/css/App.css';
import React, { useState } from 'react';
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
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));


export default function EditModal(props) {
  const {
    name, label, command, description, existingNames, onCancel, onEdit, dirEnv, dirBkgEnv, fileEnv, deskEnv,
  } = props;
  const [pname] = useState(name);
  const [plabel, setPlabel] = useState(label);
  const [pcommand, setPcommand] = useState(command);
  const [pdescription, setPdescription] = useState(description);
  const [pdirEnv, setPdirEnv] = useState(dirEnv);
  const [pdirBkgEnv, setPdirBkgEnv] = useState(dirBkgEnv);
  const [pfileEnv, setPfileEnv] = useState(fileEnv);
  const [pdeskEnv, setPdeskEnv] = useState(deskEnv);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.paper}>
        <Typography variant="h4">
          Edit shortcut
        </Typography>
        <div className={classes.fieldsCont}>
          <div>
            <TextField
              disabled
              label="Name"
              value={pname}
            />
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
              <HelpIcon />
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
              <HelpIcon />
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
              <HelpIcon />
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
                    <FolderIcon />
                    {' '}
                    Directory
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
                    <PermMediaIcon />
                    {' '}
                    Directory background
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
                    <FileCopyIcon />
                    {' '}
                    Files
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
                    <DesktopWindowsIcon />
                    {' '}
                    Desktop
                  </span>
)}
              />
            </FormGroup>
          </div>
        </div>
        <Button
          color="primary"
          onClick={() => {
            onEdit({
              name: pname, label: plabel.trimEnd(), command: pcommand, description: pdescription, dirEnv: pdirEnv, dirBkgEnv: pdirBkgEnv, fileEnv: pfileEnv, deskEnv: pdeskEnv,
            });
          }}
          variant="contained"
          disabled={plabel === '' || pcommand === ''}
        >
          Edit
        </Button>
        {' '}
        <Button
          onClick={() => {
            onCancel();
          }}
          variant="contained"
          style={{ backgroundColor: 'red', color: 'white' }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
