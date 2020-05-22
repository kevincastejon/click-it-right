import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress, Button, Typography,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ShortCut from './ShortCut';
import SearchBar from './SearchBar';

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'left',
  },
}));

export default function OwnShortcuts(props) {
  const {
    authenticated, shortcuts, loading, onCreate, onEdit, onDelete, onPublish,
  } = props;
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState([]);

  const filteredKeys = !shortcuts ? null : (filters.length === 0 ? shortcuts.concat() : shortcuts.filter((k) => filters.find((ft) => k[`${ft}Env`])))
    .filter((k) => k.name.toLowerCase().includes(search.toLowerCase()));
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div style={{ textAlign: 'right' }}>
        <Button
          style={{ marginBottom: 15 }}
          disabled={loading}
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={() => {
            onCreate();
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
      ) : !filteredKeys.length ? <h4>No shortcut</h4> : filteredKeys.map((k) => (
        <ShortCut
          authenticated={authenticated}
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
          onEdit={() => onEdit(k.name)}
          onDelete={() => onDelete(k.name)}
          onPublish={() => onPublish(k.name)}
        />
      ))}
    </div>
  );
}
OwnShortcuts.propTypes = {
  authenticated: PropTypes.bool.isRequired,
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
  loading: PropTypes.bool.isRequired,
  onCreate: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired,
};
OwnShortcuts.defaultProps = {
  shortcuts: null,
};
