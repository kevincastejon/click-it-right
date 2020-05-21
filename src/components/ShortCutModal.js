import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Modal } from '@material-ui/core';
import ShortCutForm from './ShortCutForm';

const useStyles = makeStyles(() => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));


export default function ShortCutModal(props) {
  const {
    onSubmit, onCancel, shortcuts, open, editingId,
  } = props;
  const classes = useStyles();
  return (
    <Modal
      open={open}
      className={classes.modal}
      onClose={() => onCancel()}
    >
      {!shortcuts ? <div /> : (
        <div>
          {!editingId ? (
            <ShortCutForm
              type="add"
              onCancel={() => onCancel()}
              onSubmit={(k) => onSubmit(k)}
              existingNames={shortcuts.map((k) => k.name)}
            />
          )
            : null}
          {editingId ? (
            <ShortCutForm
              type="edit"
              icon={shortcuts.find((sc) => sc.name === editingId).icon}
              name={shortcuts.find((sc) => sc.name === editingId).name}
              label={shortcuts.find((sc) => sc.name === editingId).label}
              command={shortcuts.find((sc) => sc.name === editingId).command}
              description={shortcuts.find((sc) => sc.name === editingId).description}
              dirEnv={shortcuts.find((sc) => sc.name === editingId).dirEnv}
              dirBkgEnv={shortcuts.find((sc) => sc.name === editingId).dirBkgEnv}
              fileEnv={shortcuts.find((sc) => sc.name === editingId).fileEnv}
              deskEnv={shortcuts.find((sc) => sc.name === editingId).deskEnv}
              onCancel={() => onCancel()}
              onSubmit={(k) => onSubmit(k, shortcuts.find((sc) => sc.name === editingId))}
              existingNames={shortcuts.map((k) => k.name)}
            />
          ) : null}
        </div>
      )}
    </Modal>
  );
}
ShortCutModal.propTypes = {
  shortcuts: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    command: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    dirEnv: PropTypes.bool.isRequired,
    dirBkgEnv: PropTypes.bool.isRequired,
    fileEnv: PropTypes.bool.isRequired,
    deskEnv: PropTypes.bool.isRequired,
  })),
  editingId: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
ShortCutModal.defaultProps = {
  editingId: null,
  shortcuts: null,
};
