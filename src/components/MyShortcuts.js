import { ipcRenderer } from 'electron';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress, Button, Modal, Backdrop, Typography, Dialog, DialogActions, DialogTitle,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ShortCutForm from './ShortCutForm';
import ShortCut from './ShortCut';
import SearchBar from './SearchBar';

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

export default function MyShortcuts(props) {
  const {
    onError, onNotif,
  } = props;
  const [keys, setKeys] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState([]);
  const [addingModal, setAddingModal] = useState(false);
  const [editingModal, setEditingModal] = useState(-1);
  const [deletingModal, setDeletingModal] = useState(-1);
  const [frozen, setFrozen] = useState(false);
  const [loading, setLoading] = useState(false);
  ipcRenderer.on('onError', (e, err) => {
    onError(err);
  });
  const getData = () => {
    setLoading(true);
    setKeys(null);
    ipcRenderer.once('onKeys', (e, ks) => {
      setKeys(ks);
      setLoading(false);
    });
    ipcRenderer.send('getKeys');
  };
  const addData = (key) => {
    setFrozen(true);
    setAddingModal(false);
    ipcRenderer.once('keyAdded', () => {
      onNotif('Shortcut created!');
      setFrozen(false);
      getData();
    });
    ipcRenderer.send('addKey', key);
  };
  const editData = (oldkey, key) => {
    setFrozen(true);
    setEditingModal(-1);
    ipcRenderer.once('keyEdited', () => {
      onNotif('Shortcut edited!');
      setFrozen(false);
      getData();
    });
    ipcRenderer.send('editKey', oldkey, key);
  };
  const delData = (key) => {
    setFrozen(true);
    setDeletingModal(-1);
    ipcRenderer.once('keyDeleted', () => {
      onNotif('Shortcut deleted!');
      setFrozen(false);
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
  const filteredKeys = !keys ? null : (filters.length === 0 ? keys.concat() : keys.filter((k) => filters.find((ft) => k[`${ft}Env`])))
    .filter((k) => k.name.toLowerCase().includes(search.toLowerCase()));
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Backdrop className={classes.backdrop} open={frozen}>
        <CircularProgress color="inherit" style={{ marginRight: 10 }} />
        {' '}
        Writing registry...
      </Backdrop>
      {!keys ? null : (
        <div>
          <Modal
            open={addingModal || editingModal > -1}
            className={classes.modal}
            onClose={() => {
              if (addingModal) {
                setAddingModal(false);
              } else {
                setEditingModal(-1);
              }
            }}
          >
            <div>
              {addingModal ? (
                <ShortCutForm
                  type="add"
                  onCancel={() => setAddingModal(false)}
                  onSubmit={(k) => addData(k)}
                  existingNames={keys.map((k) => k.name)}
                />
              )
                : (
                  <ShortCutForm
                    type="edit"
                    icon={editingModal > -1 ? keys[editingModal].icon : null}
                    name={editingModal > -1 ? keys[editingModal].name : null}
                    label={editingModal > -1 ? keys[editingModal].label : null}
                    command={editingModal > -1 ? keys[editingModal].command : null}
                    description={editingModal > -1 ? keys[editingModal].description : null}
                    dirEnv={editingModal > -1 ? keys[editingModal].dirEnv : null}
                    dirBkgEnv={editingModal > -1 ? keys[editingModal].dirBkgEnv : null}
                    fileEnv={editingModal > -1 ? keys[editingModal].fileEnv : null}
                    deskEnv={editingModal > -1 ? keys[editingModal].deskEnv : null}
                    onCancel={() => setEditingModal(-1)}
                    onSubmit={(k) => editData(keys[editingModal], k)}
                    existingNames={keys.map((k) => k.name)}
                  />
                )}
            </div>
          </Modal>
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
      <div style={{ textAlign: 'right' }}>
        <Button
          style={{ marginBottom: 15 }}
          disabled={loading}
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={() => {
            setAddingModal(true);
          }}
        >
          New shortcut
        </Button>
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
      {!filteredKeys ? (
        <Typography variant="h6" style={{ marginTop: 15 }}>
          <CircularProgress />
          {' '}
          Reading registry...
        </Typography>
      ) : !filteredKeys.length ? <h4>No shortcut</h4> : filteredKeys.map((k, i) => (
        <ShortCut
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
          onEdit={() => {
            setEditingModal(i);
          }}
          onDelete={() => {
            setDeletingModal(i);
          }}
        />
      ))}
    </div>
  );
}
MyShortcuts.propTypes = {
  onError: PropTypes.func.isRequired,
  onNotif: PropTypes.func.isRequired,
};
