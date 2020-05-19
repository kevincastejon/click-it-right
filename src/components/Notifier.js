import React from 'react';
import PropTypes from 'prop-types';
import {
  Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function Notifier(props) {
  const { notification, onClose } = props;
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={notification !== null}
      autoHideDuration={3000}
      onClose={() => onClose()}
    >
      {!notification ? null : (
        <Alert
          onClose={() => onClose()}
          severity={notification.type}
        >
          {notification.message}
        </Alert>
      )}
    </Snackbar>
  );
}
Notifier.propTypes = {
  notification: PropTypes.shape({
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};
Notifier.defaultProps = {
  notification: null,
};
