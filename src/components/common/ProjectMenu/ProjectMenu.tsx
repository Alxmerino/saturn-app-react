import React, { useEffect, useState } from 'react';
import {
  IconButton,
  Input,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material';
import {
  Add,
  Circle,
  DeveloperBoard,
  FormatColorFill,
} from '@mui/icons-material';

import './ProjectMenu.scss';
import { Button, Text } from '../../common';
import { colorCodeToNameMap, colorMap } from '../../../config/constants';
import { Project } from '../../../types/types';
import { isNil } from 'lodash';
import { useAppSelector } from '../../../app/hooks';
import { selectProjects } from '../../../store/Timer/TimerSlice';

export interface ProjectMenuProps {
  color?: Partial<'action' | 'primary' | 'secondary'>;
  project?: Project | null;
  projectMenuEl: null | HTMLElement;
  onOpen?: (x: any) => void;
  onClose?: (x: any) => void;
}

const ProjectMenu = ({
  color,
  project,
  projectMenuEl,
  onOpen,
  onClose,
}: ProjectMenuProps) => {
  const projects: Project[] = useAppSelector(selectProjects);
  const [projectMenuColorEl, setProjectMenuColorEl] =
    useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<string | number>(
    project?.id ?? ''
  );
  const [tempProjectTitle, setTempProjectTitle] = useState<string>('');
  const [tempColorCode, setTempColorCode] = useState<number>(0);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);

  const projectMenuOpen = Boolean(projectMenuEl);
  const projectColorMenuOpen = Boolean(projectMenuColorEl);

  const handleProjectMenuClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    if (onOpen) {
      onOpen(event.target);
    }
  };

  const handleProjectMenuClose = () => {
    if (onClose) {
      onClose({
        title: tempProjectTitle,
        colorCode: tempColorCode,
      });
      setTempProjectTitle('');
      setTempColorCode(0);
      setFilteredProjects(projects);
    }
  };

  const handleProjectColorMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setProjectMenuColorEl(event.currentTarget);
  };

  const handleProjectColorMenuClose = () => {
    setProjectMenuColorEl(null);
  };

  const handleProjectColorClick = (
    event: React.MouseEvent<HTMLAnchorElement | HTMLLIElement>
  ) => {
    const { colorCode } = event.currentTarget.dataset;
    setTempColorCode(+(colorCode ?? 0));
    handleProjectColorMenuClose();
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Eastern Egg
    if (event.target.value.toLowerCase() === 'vmg-1') {
      setSelectedProject('');
      alert('STOP! This project name will make the sky fall on your head!');
      return;
    }
    const value = event.target.value;

    setTempProjectTitle(event.target.value);

    setFilteredProjects(
      projects.filter((p) =>
        p.title.toLowerCase().includes(value.toLowerCase())
      ) ?? []
    );

    // Reset selected project
    if (!selectedProject) {
      setSelectedProject('');
    }
  };

  const handleOnKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleProjectMenuClose();
    }
  };

  const handleProjectClick = (projectId: string | number) => {
    if (onClose) {
      const project = projects.find((p) => p.id === projectId);
      onClose({
        title: '',
        colorCode: 0,
        projectId,
      });
      setTempProjectTitle('');
      setTempColorCode(project?.colorCode ?? 0);
      setFilteredProjects(projects);
    }
  };

  const RenderColorCode = (color: string) => (
    <MenuItem
      key={color}
      onClick={handleProjectColorClick}
      data-color-code={+color}
    >
      <Circle
        sx={{
          color: colorMap[colorCodeToNameMap[+color]],
        }}
      />
    </MenuItem>
  );

  useEffect(() => {
    if (isNil(project)) {
      setTempProjectTitle('');
      setSelectedProject('');
      setTempColorCode(0);
    } else if (project) {
      setTempColorCode(project.colorCode ?? 0);
      setSelectedProject(project.id);
    }
  }, [project]);

  let buttonEl;
  if (color === 'primary') {
    buttonEl = (
      <Button
        kind="outlined"
        id="project-select-button"
        aria-controls={projectMenuOpen ? 'project-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={projectMenuOpen ? 'true' : undefined}
        onClick={handleProjectMenuClick}
        sx={{ minWidth: 'auto' }}
        startIcon={
          <DeveloperBoard
            color={color}
            sx={{
              color: colorMap[colorCodeToNameMap[tempColorCode]] ?? 'primary',
            }}
          />
        }
      >
        <span style={{ fontSize: '12px' }}>Project</span>
      </Button>
    );
  } else if (selectedProject !== '') {
    const project = projects.find((p: Project) => p.id === selectedProject);

    if (!isNil(project)) {
      buttonEl = (
        <Link href="#" underline="none" onClick={handleProjectMenuClick}>
          <Text
            component="strong"
            fontWeight="bold"
            color={colorMap[colorCodeToNameMap[project.colorCode ?? 0]]}
          >
            {project.title}
          </Text>
        </Link>
      );
    }
  } else {
    buttonEl = (
      <Button
        kind="text"
        size="small"
        onClick={handleProjectMenuClick}
        disableRipple
        startIcon={
          <DeveloperBoard
            color={color}
            sx={{
              color: colorMap[colorCodeToNameMap[tempColorCode]] ?? 'primary',
            }}
          />
        }
      >
        <span>Project</span>
      </Button>
    );
  }

  return (
    <>
      {buttonEl}
      <Menu
        id="project-menu"
        anchorEl={projectMenuEl}
        open={projectMenuOpen}
        onClose={handleProjectMenuClose}
        MenuListProps={{
          'aria-labelledby': 'project-menu-button',
        }}
      >
        <MenuItem
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
        >
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
            <FormatColorFill
              sx={{
                color: colorMap[colorCodeToNameMap[tempColorCode]] ?? '',
              }}
            />
          </IconButton>
          <Button
            onClick={handleProjectMenuClose}
            disabled={!tempProjectTitle}
            kind="primary"
            size="small"
          >
            <Add />
          </Button>
          <Menu
            id="color-code"
            anchorEl={projectMenuColorEl}
            open={projectColorMenuOpen}
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
            {Object.keys(colorCodeToNameMap).map(RenderColorCode)}
          </Menu>
        </MenuItem>
        {filteredProjects?.length ? (
          <MenuList
            dense
            sx={{
              maxHeight: 155,
              overflow: 'auto',
            }}
          >
            {filteredProjects.map((p) => (
              <MenuItem
                key={p.id}
                selected={p.id === project?.id}
                onClick={() => handleProjectClick(p.id)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: '22px !important',
                  }}
                >
                  <Circle
                    sx={{
                      width: 10,
                      height: 10,
                      color: colorMap[colorCodeToNameMap[+(p?.colorCode ?? 0)]],
                    }}
                  />
                </ListItemIcon>
                <ListItemText>{p.title}</ListItemText>
              </MenuItem>
            ))}
          </MenuList>
        ) : null}
      </Menu>
    </>
  );
};

export default ProjectMenu;
