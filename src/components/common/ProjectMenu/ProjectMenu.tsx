import React, { useState } from 'react';

import { IconButton, Input, Menu, MenuItem } from '@mui/material';
import { DeveloperBoard } from '@mui/icons-material';

import { Button } from '../../common';

export interface ProjectMenuProps {
  color?: Partial<'action' | 'primary' | 'secondary'>;
}

const ProjectMenu = ({ color }: ProjectMenuProps) => {
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
            placeholder="Project Name"
            inputProps={{ 'aria-label': 'description' }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleProjectMenuClose();
              }
            }}
          />
        </MenuItem>
        <MenuItem onClick={handleProjectMenuClose}>TEST-123</MenuItem>
      </Menu>
    </>
  );
};

export default ProjectMenu;
