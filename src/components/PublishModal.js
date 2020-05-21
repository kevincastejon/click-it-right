import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Modal } from '@material-ui/core';
import PublishForm from './PublishForm';

const useStyles = makeStyles(() => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // outline: 'none',
  },
}));


export default function PublishModal(props) {
  const {
    onSubmit, onCancel, shortcuts, open, currentGitStep, gitSteps,
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
          <PublishForm
            shortcuts={shortcuts}
            gitSteps={gitSteps}
            currentGitStep={currentGitStep}
            onCancel={() => {
              onCancel();
            }}
            onSubmit={(name) => {
              onSubmit(name);
            }}
          />
        </div>
      )}
    </Modal>
  );
}
PublishModal.propTypes = {
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
  open: PropTypes.bool.isRequired,
  gitSteps: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    labelAfter: PropTypes.string,
    labelError: PropTypes.string,
    color: PropTypes.oneOf(['primary', 'secondary']),
  })).isRequired,
  currentGitStep: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
PublishModal.defaultProps = {
  shortcuts: null,
};
