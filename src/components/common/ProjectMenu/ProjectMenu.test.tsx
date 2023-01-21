import React, { useState } from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import ProjectMenu from './ProjectMenu';
import { render } from '../../../tests/test-utils';
import { Project } from '../../../types/timer';

interface SetupProps {
  onOpen?: () => void;
  onClose?: (args?: any) => void;
}

async function setup({ onOpen, onClose }: SetupProps) {
  const project = {
    title: 'My Project',
    colorCode: 4,
  };
  const Component = ({ onOpen, onClose }: SetupProps) => {
    const [projectMenuEl, setProjectMenuEl] = useState<null | HTMLElement>(
      null
    );

    const handleOnOpen = (e: any) => {
      if (onOpen) {
        onOpen();
      }

      setProjectMenuEl(e);
    };

    const handleOnClose = (args: any) => {
      if (onClose) {
        onClose(args);
      }

      setProjectMenuEl(null);
    };

    return (
      <ProjectMenu
        color="primary"
        project={null}
        projectMenuEl={projectMenuEl}
        onOpen={handleOnOpen}
        onClose={handleOnClose}
      />
    );
  };

  const dom = render(<Component onOpen={onOpen} onClose={onClose} />);

  const openProjectMenu = () => userEvent.click(dom.getByText('Project'));
  const getProjectInput = () => dom.getByPlaceholderText('Project Name');

  const changeProjectTitle = (value: string) =>
    userEvent.type(getProjectInput(), value);

  const clickSubmit = () => userEvent.click(dom.getByText('Add Project'));

  return {
    changeProjectTitle,
    clickSubmit,
    dom,
    getProjectInput,
    openProjectMenu,
    project,
  };
}

async function setupWithMenuOpen(args: SetupProps) {
  const utils = await setup(args);

  utils.openProjectMenu();
  const projectInput = utils.getProjectInput();

  return { ...utils, projectInput };
}

async function setupWithColorMenuOpen(args: SetupProps) {
  const utils = await setupWithMenuOpen(args);

  await utils.changeProjectTitle(utils.project.title);
  const colorSelector = screen.getByText('Select Color');
  await userEvent.click(colorSelector);
  const projectColors = await screen.findAllByText(/Color /i);

  return { ...utils, projectColors };
}

test('shows project menu when clicked', async () => {
  const { projectInput } = await setupWithMenuOpen({});

  expect(projectInput).toBeTruthy();
});

test('shows color menu when color button clicked', async () => {
  const { projectColors } = await setupWithColorMenuOpen({});

  expect(projectColors).toBeTruthy();
  expect(projectColors?.length).toBe(12);
});

test('adds project title and color when + button is clicked', async () => {
  let _project = {};
  const expected = {
    title: 'New Project',
    colorCode: 4,
  };
  function onClose(args: any) {
    _project = args;
  }

  const { clickSubmit, changeProjectTitle } = await setupWithColorMenuOpen({
    onOpen: jest.fn(),
    onClose,
  });

  await userEvent.click(screen.getByText(/Color lime/i));
  await changeProjectTitle(expected.title);

  clickSubmit();

  expect(_project).toEqual(expected);
});
