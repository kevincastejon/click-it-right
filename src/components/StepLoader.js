import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  LinearProgress, Typography, Grid,
} from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

const useStyles = makeStyles(() => ({
  linear: {
    height: 2,
  },
}));


export default function StepLoader(props) {
  const {
    steps, color, currentStep, currentProgress, errors,
  } = props;
  const classes = useStyles();
  return (
    <div>
      <Grid
        style={{ width: '80%', margin: 'auto' }}
        container
        spacing={1}
      >
        {steps.map((s, i) => (
          <Grid
            key={s.label}
            container
            item
            xs={12}
            spacing={1}
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <Grid xs item>
              <Typography
                variant="subtitle2"
                style={{
                  fontWeight: currentStep >= i ? 'bold' : 'normal',
                  color: errors.includes(i) ? 'red' : 'inherited',
                  fontStyle: currentStep > i ? 'oblique' : 'normal',
                }}
              >
                {errors.includes(i) && s.labelError ? s.labelError : (currentStep > i && s.labelAfter ? s.labelAfter : s.label)}
              </Typography>
            </Grid>
            <Grid xs item>
              <LinearProgress
                className={classes.linear}
                variant={(currentStep === i && currentProgress === -1 ? 'indeterminate' : 'determinate')}
                value={currentStep > i ? 100 : (currentStep === i && currentProgress > -1 ? currentProgress : 0)}
                color={s.color ? s.color : color}
              />
            </Grid>
            <Grid item>
              {errors.includes(i) ? <ErrorIcon color="secondary" /> : (currentStep > i ? <CheckCircleIcon style={{ color: 'green' }} /> : <CheckCircleOutlineIcon style={{ color: currentStep === i ? 'black' : 'grey' }} />)}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
StepLoader.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    labelAfter: PropTypes.string,
    labelError: PropTypes.string,
    color: PropTypes.oneOf(['primary', 'secondary']),
  })).isRequired,
  currentStep: PropTypes.number.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary']),
  currentProgress: PropTypes.number,
  errors: PropTypes.arrayOf(PropTypes.number),
};
StepLoader.defaultProps = {
  color: 'primary',
  currentProgress: -1,
  errors: [],
};
