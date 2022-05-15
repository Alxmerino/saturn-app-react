import React, { SetStateAction, useEffect, useState } from 'react';

import { IconButton, Input, Link, Menu, MenuItem } from '@mui/material';
import { Circle, DeveloperBoard, FormatColorFill } from '@mui/icons-material';

import './ProjectMenu.scss';
import { Button, Text } from '../../common';
import { colorMap } from '../../../config/constants';
import { ColorCode, Project } from '../../../types/types';
import { isNil } from 'lodash';

export interface ProjectMenuProps {
  color?: Partial<'action' | 'primary' | 'secondary'>;
  project?: Partial<Project> | null;
  projectMenuEl: null | HTMLElement;
  setProject?: React.Dispatch<SetStateAction<Partial<Project> | null>>;
  onOpen?: (x: any) => void;
  onClose?: (x: any) => void;
}

const ProjectMenu = ({
  color,
  project,
  setProject,
  projectMenuEl,
  onOpen,
  onClose,
}: ProjectMenuProps) => {
  const [projectMenuColorEl, setProjectMenuColorEl] =
    useState<null | HTMLElement>(null);
  const [tempProjectTitle, setTempProjectTitle] = useState<string>(
    project?.title ?? ''
  );
  const [projectTitle, setProjectTitle] = useState<string>(
    project?.title ?? ''
  );
  const [colorCode, setColorCode] = useState<string>(project?.colorCode ?? '');
  const projectOpen = Boolean(projectMenuEl);
  const projectColorOpen = Boolean(projectMenuColorEl);

  const handleProjectMenuClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    if (onOpen) {
      onOpen(event.target);
    }
  };

  const handleProjectColorMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setProjectMenuColorEl(event.currentTarget);
  };

  const handleProjectMenuClose = () => {
    setProjectTitle(tempProjectTitle);
    if (onClose) {
      onClose(null);
    }
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
    if (event.target.value.toLowerCase() === 'vmg-1') {
      setProjectTitle('');
      alert('STOP! This project name will make the sky fall on your head!');
      return;
    }
    setTempProjectTitle(event.target.value);
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
        colorCode: colorCode as ColorCode,
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
  } else if (projectTitle !== '') {
    buttonEl = (
      <Link href="#" underline="none" onClick={handleProjectMenuClick}>
        <Text
          component="strong"
          fontWeight="bold"
          color={colorMap[colorCode ?? 'black']}
        >
          {projectTitle}
        </Text>
      </Link>
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
            value={tempProjectTitle}
          />
          <IconButton
            onClick={handleProjectColorMenuClick}
            disabled={!tempProjectTitle}
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
