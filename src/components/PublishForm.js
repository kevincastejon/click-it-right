import '../assets/css/App.css';
import React, { useState } from 'react';
import { shell } from 'electron';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography, Stepper, StepLabel, Step, Button, ListItemAvatar, ListItemText, ListItem, List, Avatar, Tooltip, Grid, Link, Card,
} from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import GitHubIcon from '@material-ui/icons/GitHub';
import noicon from '../assets/img/noicon.png';
import StepLoader from './StepLoader';

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
  list: {
    margin: 25,

    overflow: 'auto',
    maxHeight: 300,

  },
  item: {
    backgroundColor: '#fafdff',
  },
  inline: {
    display: 'inline',
  },
}));


export default function PublishForm(props) {
  const {
    preSelection, onCancel, onSubmit, shortcuts, currentGitStep, gitSteps,
  } = props;
  const [publishingId, setPublishingId] = useState(preSelection);
  const [currentStep, setCurrentStep] = useState(0);
  const classes = useStyles();

  let prevBtnDisabled = false;
  if (currentStep >= 3 || currentStep === 0) {
    prevBtnDisabled = true;
  }
  if (currentStep === 0 && publishingId > -1) {
    prevBtnDisabled = true;
  }
  let nextBtnDisabled = false;
  if (currentStep >= 3 || (currentStep === 0 && publishingId === -1)) {
    nextBtnDisabled = true;
  }
  return (
    <div className={classes.root}>
      <div className={classes.paper}>
        <Typography variant="h4">
          Publish shortcut
        </Typography>
        <Stepper activeStep={currentStep}>
          <Step key={0} completed={currentStep > 0}>
            <StepLabel>Select</StepLabel>
          </Step>
          <Step key={1} completed={currentStep > 1}>
            <StepLabel>Review</StepLabel>
          </Step>
          <Step key={2} completed={currentStep > 2}>
            <StepLabel>Submit</StepLabel>
          </Step>
        </Stepper>
        <div>
          {currentStep !== 0 ? null
            : (
              <div>
                <Typography variant="h5" style={{ marginBottom: 20 }}>
                  Select a shortcut
                </Typography>
                <List component="nav" className={classes.list}>
                  {shortcuts.map((sc, i) => (
                    <Tooltip title={sc.description.length === 0 || !sc.icon ? 'A shortcut must have a description and an icon to be published!' : ''} arrow key={sc.name}>
                      <ListItem
                        className={classes.item}
                        selected={publishingId === i}
                        button
                        alignItems="flex-start"
                        onClick={() => (sc.description.length === 0 || !sc.icon ? null : setPublishingId(i))}
                      >
                        <ListItemAvatar>
                          <Avatar variant="rounded" alt="icon" src={sc.icon || noicon} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={sc.name}
                          secondary={(
                            <Typography color={sc.description.length === 0 || !sc.icon ? 'secondary' : 'primary'}>
                              {sc.description.length === 0 || !sc.icon ? 'Ineligible to publish' : 'Eligible to publish'}
                            </Typography>
                      )}
                        />
                      </ListItem>
                    </Tooltip>
                  ))}
                </List>
              </div>
            )}
          {currentStep !== 1 ? null
            : (
              <div>
                <Typography variant="h5" style={{ marginBottom: 20 }}>
                  Review your shortcut
                </Typography>
                <Grid
                  style={{ width: '80%', margin: 'auto' }}
                  container
                  spacing={1}
                >
                  <Grid
                    container
                    item
                    xs={12}
                    spacing={1}
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid item xs={4}>
                      <Typography variant="h6" style={{ textAlign: 'left' }}>
                        Name:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography
                        variant="subtitle2"
                        style={{ textAlign: 'left' }}
                      >
                        {shortcuts[publishingId].name}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    item
                    xs={12}
                    spacing={1}
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid item xs={4}>
                      <Typography variant="h6" style={{ textAlign: 'left' }}>
                        Label:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography
                        variant="subtitle2"
                        style={{ textAlign: 'left' }}
                      >
                        {shortcuts[publishingId].label}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    item
                    xs={12}
                    spacing={1}
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid item xs={4}>
                      <Typography variant="h6" style={{ textAlign: 'left' }}>
                        Command:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography
                        title={shortcuts[publishingId].command}
                        variant="subtitle2"
                        style={{ textAlign: 'left' }}
                      >
                        {`${shortcuts[publishingId].command.substring(0, 50)}...`}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    item
                    xs={12}
                    spacing={1}
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid item xs={4}>
                      <Typography variant="h6" style={{ textAlign: 'left' }}>
                        Description:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography
                        variant="subtitle2"
                        title={shortcuts[publishingId].description}
                        style={{ textAlign: 'left' }}
                      >
                        {`${shortcuts[publishingId].description.substring(0, 50)}...`}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    item
                    xs={12}
                    spacing={1}
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid item xs={4}>
                      <Typography variant="h6" style={{ textAlign: 'left' }}>
                        Environments:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <div style={{ textAlign: 'left' }}>
                        {!shortcuts[publishingId].dirEnv ? null : <span style={{ marginLeft: 0 }} title="Directory"><FolderIcon style={{ verticalAlign: 'bottom' }} /></span> }
                        {!shortcuts[publishingId].dirBkgEnv ? null : <span style={{ marginLeft: 10 }} title="Directory background"><PermMediaIcon style={{ verticalAlign: 'bottom' }} /></span>}
                        {!shortcuts[publishingId].fileEnv ? null : <span style={{ marginLeft: 10 }} title="Files"><FileCopyIcon style={{ verticalAlign: 'bottom' }} /></span>}
                        {!shortcuts[publishingId].deskEnv ? null : <span style={{ marginLeft: 10 }} title="Desktop"><DesktopWindowsIcon style={{ verticalAlign: 'bottom' }} /></span>}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>

              </div>
            )}
          {currentStep !== 2 ? null
            : (
              <div>
                <Typography variant="h5" style={{ marginBottom: 20 }}>
                  Submit your shorcut
                </Typography>
                <Typography variant="subtitle2" style={{ textAlign: 'left' }}>
                  This will create a fork of the
                  {' '}
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      shell.openExternal('https://github.com/click-it-right-community/community-shortcuts');
                    }}
                  >
                    community-shortcuts
                  </Link>
                  {' '}
                  GitHub repo on your own GitHub account (if not already have).
                  <br />
                  Then it will create a branch containing your shortcut adding and create a pull request from it.
                  <br />
                  When your shortcut will be accepted (or not !) you will be able to find it on the Community Shortcut menu.
                </Typography>
              </div>
            )}
          {currentStep !== 3 ? null
            : (
              <div>
                <Typography variant="h5" style={{ marginBottom: 20 }}>
                  Operating GitHub API
                  {' '}
                  <GitHubIcon />
                </Typography>
                <Card style={{ backgroundColor: '#fafdff', width: '80%', margin: 'auto' }}>
                  <StepLoader
                    steps={gitSteps}
                    currentStep={currentGitStep}
                  />
                </Card>
              </div>
            )}
        </div>
        <div style={{ marginTop: 100 }}>
          <Button
            disabled={prevBtnDisabled}
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            Previous
          </Button>
          <Button
            color="primary"
            disabled={nextBtnDisabled}
            onClick={() => {
              if (currentStep === 2) {
                onSubmit(shortcuts[publishingId].name);
              }
              setCurrentStep(currentStep + 1);
            }}
          >
            {currentStep === 2 ? 'Submit' : 'Next'}
          </Button>
          <Button
            disabled={currentStep === 3}
            color="secondary"
            onClick={() => onCancel()}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
PublishForm.propTypes = {
  preSelection: PropTypes.number,
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
  gitSteps: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    labelAfter: PropTypes.string,
    labelError: PropTypes.string,
    color: PropTypes.oneOf(['primary', 'secondary']),
  })).isRequired,
  currentGitStep: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
PublishForm.defaultProps = {
  preSelection: -1,
  shortcuts: null,
};
