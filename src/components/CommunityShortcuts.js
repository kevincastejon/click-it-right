import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress, Button, Typography, Tooltip,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SearchBar from './SearchBar';
import ShortCut from './ShortCut';

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'left',
  },
}));

export default function CommunityShortcuts(props) {
  const {
    authenticated, ownShortcuts, commuShortcuts, loading, onInstall, onReplace, onPublish,
  } = props;
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState([]);

  const filteredKeys = loading ? null : (filters.length === 0 ? commuShortcuts.concat() : commuShortcuts.filter((k) => filters.find((ft) => k[`${ft}Env`])))
    .filter((k) => k.name.toLowerCase().includes(search.toLowerCase()));
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div style={{ textAlign: 'right' }}>
        <Tooltip title={!authenticated ? 'You have to sign in to publish' : ''}>
          <span>
            <Button
              style={{ marginBottom: 15 }}
              disabled={!authenticated || loading}
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={() => {
                onPublish();
              }}
            >
              Publish a shortcut
            </Button>
          </span>
        </Tooltip>
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
          Reading community shortcuts...
        </Typography>
      ) : !filteredKeys.length ? <h4>No shortcut</h4> : filteredKeys.map((k) => (
        <ShortCut
          owned={ownShortcuts.map((key) => key.name).includes(k.name)}
          type="commu"
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
          onReplace={() => {
            onReplace(k.name);
          }}
          onInstall={() => {
            onInstall(k.name);
          }}
        />
      ))}
    </div>
  );
}
CommunityShortcuts.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  ownShortcuts: PropTypes.arrayOf(PropTypes.shape({
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
  commuShortcuts: PropTypes.arrayOf(PropTypes.shape({
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
  loading: PropTypes.bool.isRequired,
  onInstall: PropTypes.func.isRequired,
  onReplace: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired,
};
CommunityShortcuts.defaultProps = {
  ownShortcuts: null,
  commuShortcuts: null,
};
