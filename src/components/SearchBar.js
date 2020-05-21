import React from 'react';
import PropTypes from 'prop-types';
import {
  TextField, Typography, InputAdornment,
} from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import SearchIcon from '@material-ui/icons/Search';
import FolderIcon from '@material-ui/icons/Folder';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';

export default function SearchBar(props) {
  const {
    search, filters, onSearchChange, onFiltersChange,
  } = props;
  return (
    <div>
      <TextField
        value={search}
        onChange={(e) => {
          onSearchChange(e.target.value.replace(/ /g, ''));
        }}
        style={{ marginTop: 10 }}
        id="standard-search"
        placeholder="search"
        type="search"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Typography variant="overline">
        <label style={{ marginLeft: 20, marginRight: 10 }}>
          Environments
        </label>
      </Typography>
      <ToggleButtonGroup
        value={filters}
        onChange={(e, newFilters) => {
          onFiltersChange(newFilters);
        }}
        aria-label="text formatting"
      >
        <ToggleButton title="Directory" value="dir" aria-label="directory">
          <FolderIcon />
        </ToggleButton>
        <ToggleButton title="Directory background" value="dirBkg" aria-label="directory-background">
          <PermMediaIcon />
        </ToggleButton>
        <ToggleButton title="Files" value="file" aria-label="files">
          <FileCopyIcon />
        </ToggleButton>
        <ToggleButton title="Desktop" value="desk" aria-label="desktop">
          <DesktopWindowsIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
SearchBar.propTypes = {
  onSearchChange: PropTypes.func.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  filters: PropTypes.arrayOf(PropTypes.string).isRequired,
};
