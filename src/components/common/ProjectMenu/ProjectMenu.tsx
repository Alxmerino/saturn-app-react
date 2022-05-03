import React, { SetStateAction, useEffect, useState } from 'react';

import { IconButton, Input, Menu, MenuItem } from '@mui/material';
import { Circle, DeveloperBoard, FormatColorFill } from '@mui/icons-material';

import './ProjectMenu.scss';
import { Button } from '../../common';
import { colorMap } from '../../../config/constants';
import { Project } from '../../../types/types';
import { isNil } from 'lodash';

export interface ProjectMenuProps {
  color?: Partial<'action' | 'primary' | 'secondary'>;
  project?: Partial<Project> | null;
  setProject?: React.Dispatch<SetStateAction<Partial<Project> | null>>;
}

const ProjectMenu = ({ color, project, setProject }: ProjectMenuProps) => {
  const [projectMenuEl, setProjectMenuEl] = useState<null | HTMLElement>(null);
  const [projectMenuColorEl, setProjectMenuColorEl] =
    useState<null | HTMLElement>(null);
  const [projectTitle, setProjectTitle] = useState<string>(
    project?.title ?? ''
  );
  const [colorCode, setColorCode] = useState<string>(project?.colorCode ?? '');
  const projectOpen = Boolean(projectMenuEl);
  const projectColorOpen = Boolean(projectMenuColorEl);

  const handleProjectMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setProjectMenuEl(event.currentTarget);
  };

  const handleProjectColorMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setProjectMenuColorEl(event.currentTarget);
  };

  const handleProjectMenuClose = () => {
    setProjectMenuEl(null);
  };

  const handleProjectColorMenuClose = () => {
    setProjectMenuColorEl(null);
  };

  const handleProjectColorClick = (
    event: React.MouseEvent<HTMLAnchorElement | HTMLLIElement>
  ) => {
    setColorCode(event.currentTarget.dataset.colorCode ?? '');
    handleProjectColorMenuClose();
    handleProjectMenuClose();
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectTitle(event.target.value);
  };

  const handleOnKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleProjectMenuClose();
    }
  };

  const RenderColorCode = (color: string) => (
    <MenuItem
      key={color}
      onClick={handleProjectColorClick}
      data-color-code={color}
    >
      <Circle
        sx={{
          color: colorMap[color],
        }}
      />
    </MenuItem>
  );

  useEffect(() => {
    if (setProject && projectTitle !== '') {
      setProject((state) => ({
        ...state,
        title: projectTitle,
        color: colorCode,
      }));
    }
  }, [projectTitle, colorCode]);

  useEffect(() => {
    if (isNil(project)) {
      setProjectTitle('');
      setColorCode('');
    }
  }, [project]);

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
        <DeveloperBoard
          color={color}
          sx={{
            color: colorMap[colorCode] ?? 'primary',
          }}
        />
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
            value={projectTitle}
          />
          <IconButton
            onClick={handleProjectColorMenuClick}
            disabled={!projectTitle}
          >
            <FormatColorFill sx={{ color: colorMap[colorCode] ?? '' }} />
          </IconButton>
          <Menu
            id="color-code"
            anchorEl={projectMenuColorEl}
            open={projectColorOpen}
            onClose={handleProjectColorMenuClose}
            MenuListProps={{
              'aria-labelledby': 'color-code-button',
            }}
            sx={{
              width: '200px',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {Object.keys(colorMap).map(RenderColorCode)}
          </Menu>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProjectMenu;
