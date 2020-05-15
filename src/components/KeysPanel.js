import { ipcRenderer } from 'electron';
import '../assets/css/App.css';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress, Button, Modal, IconButton, Typography, Card, CardActionArea, CardActions, CardContent,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FolderIcon from '@material-ui/icons/Folder';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddModal from './AddModal';
import EditModal from './EditModal';
//
// const types = {
//   dir: 'dir',
//   dirBkg: 'dirBkg',
//   file: 'file',
//   desk: 'desk',
// };

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'left',
    marginLeft: 50,
    marginRight: 50,
  },
  card: {
    marginTop: '20px',
    backgroundColor: '#fafdff',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));


export default function KeysPanel() {
  const [keys, setKeys] = useState(null);
  const [addingModal, setAddingModal] = useState(false);
  const [editingModal, setEditingModal] = useState(-1);
  const [deletingModal, setDeletingModal] = useState(-1);
  const [frozen, setFrozen] = useState(false);
  const getData = () => {
    setFrozen(true);
    ipcRenderer.once('onKeys', (e, ks) => {
      setKeys(ks);
      setFrozen(false);
    });
    ipcRenderer.send('getKeys');
  };
  const addData = (key) => {
    setFrozen(true);
    setAddingModal(false);
    setKeys(null);
    ipcRenderer.once('keyAdded', () => {
      getData();
    });
    ipcRenderer.send('addKey', key);
  };
  const editData = (key) => {
    setFrozen(true);
    setEditingModal(-1);
    setKeys(null);
    ipcRenderer.once('keyEdited', () => {
      getData();
    });
    ipcRenderer.send('editKey', key);
  };
  const delData = (key) => {
    setFrozen(true);
    setDeletingModal(-1);
    setKeys(null);
    ipcRenderer.once('keyDeleted', () => {
      getData();
    });
    ipcRenderer.send('deleteKey', key);
  };
  useEffect(() => {
    getData();
    return (() => {
      ipcRenderer.removeAllListeners();
    });
  }, []);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {!keys ? null : (
        <div>
          <Modal
            open={addingModal}
            className={classes.modal}
            onClose={() => {
              setAddingModal(false);
            }}
          >
            <div>
              <AddModal onCancel={() => setAddingModal(false)} onCreate={(k) => addData(k)} existingNames={keys.map((k) => k.name)} />
            </div>

          </Modal>
          {editingModal === -1 ? null : (
            <Modal
              open={editingModal > -1}
              className={classes.modal}
              onClose={() => {
                setEditingModal(-1);
              }}
            >
              <div>
                <EditModal
                  name={keys[editingModal].name}
                  label={keys[editingModal].label}
                  command={keys[editingModal].command}
                  description={keys[editingModal].description}
                  dirEnv={keys[editingModal].dirEnv}
                  dirBkgEnv={keys[editingModal].dirBkgEnv}
                  fileEnv={keys[editingModal].fileEnv}
                  deskEnv={keys[editingModal].deskEnv}
                  onCancel={() => setEditingModal(-1)}
                  onEdit={(k) => editData(k)}
                  existingNames={keys.map((k) => k.name)}
                />
              </div>

            </Modal>
          )}
          <Dialog
            open={deletingModal > -1}
            onClose={() => setDeletingModal(false)}
          >
            <DialogTitle>Really delete this shortcut?</DialogTitle>
            <DialogActions>
              <Button onClick={() => delData(keys[deletingModal])} color="secondary">
                Delete
              </Button>
              <Button onClick={() => setDeletingModal(-1)} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
      <br />
      <br />
      <div style={{ textAlign: 'right' }}>
        <Button
          disabled={frozen}
          style={{ backgroundColor: frozen ? 'grey' : 'green', color: 'white' }}
          startIcon={<AddCircleIcon />}
          onClick={() => {
            setAddingModal(true);
          }}
        >
          New shortcut
        </Button>
      </div>
      <br />
      <br />
      <Typography variant="h4" gutterBottom>
        My shortcuts
      </Typography>
      {!keys ? (
        <h3>
          <CircularProgress />
          {' '}
          Loading...
        </h3>
      ) : !keys.length ? <h4>No shortcut</h4> : keys.map((k, i) => (
        <Card className={classes.card} key={k.name}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {k.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                <label style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                  Label:
                  {' '}
                </label>
                <span>
                  {k.label}
                </span>
                <br />
                <label style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                  Command:
                  {' '}
                </label>
                <span title={k.command}>{`${k.command}`}</span>
                <br />
                <label style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                  Environment:
                  {' '}
                </label>
                {!k.dirEnv ? null : <span style={{ marginLeft: 10 }} title="Directory"><FolderIcon /></span>}
                {!k.dirBkgEnv ? null : <span style={{ marginLeft: 10 }} title="Directory background"><PermMediaIcon /></span>}
                {!k.fileEnv ? null : <span style={{ marginLeft: 10 }} title="Files"><FileCopyIcon /></span>}
                {!k.deskEnv ? null : <span style={{ marginLeft: 10 }} title="Desktop"><DesktopWindowsIcon /></span>}
                <br />
                <label style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                  Description:
                  {' '}
                </label>
                <span>{`${k.description}`}</span>
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <IconButton
              style={{ color: 'blue' }}
              onClick={() => {
                setEditingModal(i);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              style={{ color: 'red' }}
              onClick={() => {
                setDeletingModal(i);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </div>
  );
}
