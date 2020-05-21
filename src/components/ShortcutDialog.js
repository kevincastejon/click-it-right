import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogTitle, DialogActions, Button,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';

export default function ShortcutDialog(props) {
  const {
    type, open, name, onSubmit, onCancel,
  } = props;
  return (
    <Dialog
      open={open}
      onClose={() => onCancel()}
    >
      {!open ? null : (
        <div>
          <DialogTitle>
            Really
            {' '}
            {type === 'delete' ? 'delete' : (type === 'install' ? 'install' : 'replace')}
            {' '}
            this shortcut?
            <p>
              <ArrowRightIcon style={{ verticalAlign: 'middle' }} />
              {name}
            </p>
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() => onSubmit()}
              color={type === 'install' ? 'primary' : 'secondary'}
              startIcon={type === 'delete' ? <DeleteIcon /> : (
                <SystemUpdateAltIcon />
              )}
            >
              {type === 'delete' ? 'Delete' : (type === 'install' ? 'Install' : 'Replace')}
            </Button>
            <Button onClick={() => onCancel()} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </div>
      )}
    </Dialog>
  );
}
ShortcutDialog.propTypes = {
  type: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
