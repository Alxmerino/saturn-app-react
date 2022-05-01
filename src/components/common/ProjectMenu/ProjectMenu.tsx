import React, { useState } from 'react';

import { IconButton, Input, Menu, MenuItem } from '@mui/material';
import { DeveloperBoard, FormatColorFill } from '@mui/icons-material';

import { Button } from '../../common';

export interface ProjectMenuProps {
  color?: Partial<'action' | 'primary' | 'secondary'>;
  inputValue?: string;
  setInputValue?: React.Dispatch<React.SetStateAction<string>>;
}

const ProjectMenu = ({
  color,
  inputValue,
  setInputValue,
}: ProjectMenuProps) => {
  const [projectMenuEl, setProjectMenuEl] = useState<null | HTMLElement>(null);
  const projectOpen = Boolean(projectMenuEl);

  const handleProjectMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setProjectMenuEl(event.currentTarget);
  };

  const handleProjectMenuClose = () => {
    setProjectMenuEl(null);
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (setInputValue) {
      setInputValue(event.target.value);
    }
  };

  const handleOnKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleProjectMenuClose();
    }
  };

  let buttonEl;
  if (color === 'primary') {
    buttonEl = (
      <Button
        kind="outlined"
        id="project-select-button"
        aria-controls={projectOpen ? 'project-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={projectOpen ? 'true' : undefined}
        onClick={handleProjectMenuClick}
      >
        <DeveloperBoard color={color} />
      </Button>
    );
  } else {
    buttonEl = (
      <IconButton edge="start" onClick={handleProjectMenuClick}>
        <DeveloperBoard color={color} />
      </IconButton>
    );
  }

  return (
    <>
      {buttonEl}
      <Menu
        id="project-menu"
        anchorEl={projectMenuEl}
        open={projectOpen}
        onClose={handleProjectMenuClose}
        MenuListProps={{
          'aria-labelledby': 'project-menu-button',
        }}
      >
        <MenuItem>
          <Input
            autoFocus={true}
            disableUnderline={true}
            margin="dense"
            placeholder="Project Name"
            inputProps={{ 'aria-label': 'description' }}
            onChange={handleOnChange}
            onKeyPress={handleOnKeyPress}
            value={inputValue}
          />
          <IconButton>
            <FormatColorFill />
          </IconButton>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProjectMenu;
