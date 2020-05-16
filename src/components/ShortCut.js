import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton, Typography, Card, CardActionArea, CardActions, CardContent,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FolderIcon from '@material-ui/icons/Folder';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';

const useStyles = makeStyles(() => ({
  card: {
    marginTop: 20,
    backgroundColor: '#fafdff',
  },
  avatar: {
    verticalAlign: 'bottom',
    marginRight: 10,
  },
}));


export default function ShortCut(props) {
  const {
    icon, name, label, description, command, dirEnv, dirBkgEnv, fileEnv, deskEnv, onEdit, onDelete,
  } = props;
  const classes = useStyles();
  return (
    <Card className={classes.card} key={name}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {icon ? <img className={classes.avatar} height={48} alt="icon" src={icon} /> : null}
            {name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" style={{ lineHeight: '20px' }}>
            <label style={{
              display: 'inline-block', width: 110, fontWeight: 'bold', textDecoration: 'underline',
            }}
            >
              Label:
              {' '}
            </label>
            <span>
              {label}
            </span>
            <br />
            <label style={{
              display: 'inline-block', width: 110, fontWeight: 'bold', textDecoration: 'underline',
            }}
            >
              Command:
              {' '}
            </label>
            <span title={command}>{`${command}`}</span>
            <br />
            <label style={{
              display: 'inline-block', width: 110, fontWeight: 'bold', textDecoration: 'underline',
            }}
            >
              Environments:
              {' '}
            </label>
            {!dirEnv ? null : <span style={{ marginLeft: 0 }} title="Directory"><FolderIcon style={{ verticalAlign: 'bottom' }} /></span>}
            {!dirBkgEnv ? null : <span style={{ marginLeft: 10 }} title="Directory background"><PermMediaIcon style={{ verticalAlign: 'bottom' }} /></span>}
            {!fileEnv ? null : <span style={{ marginLeft: 10 }} title="Files"><FileCopyIcon style={{ verticalAlign: 'bottom' }} /></span>}
            {!deskEnv ? null : <span style={{ marginLeft: 10 }} title="Desktop"><DesktopWindowsIcon style={{ verticalAlign: 'bottom' }} /></span>}
            <br />
            <label style={{
              display: 'inline-block', width: 110, fontWeight: 'bold', textDecoration: 'underline',
            }}
            >
              Description:
              {' '}
            </label>
            <span>{`${description}`}</span>
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <IconButton
          color="primary"
          onClick={() => onEdit()}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={() => onDelete()}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
ShortCut.propTypes = {
  icon: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  command: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  dirEnv: PropTypes.bool.isRequired,
  dirBkgEnv: PropTypes.bool.isRequired,
  fileEnv: PropTypes.bool.isRequired,
  deskEnv: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};
ShortCut.defaultProps = {
  icon: null,
};
