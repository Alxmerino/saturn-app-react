import React from 'react';
import { Stack } from '@mui/material';

interface GenericLayoutProps {
  vAlign?: string;
  children: JSX.Element | JSX.Element[];
}

const GenericLayout = ({
  vAlign = 'top',
  children,
}: GenericLayoutProps): JSX.Element => {
  const vAlignMap: Record<string, string> = {
    top: 'flex-start',
    center: 'center',
    bottom: 'flex-end',
  };

  return (
    <Stack justifyContent={vAlignMap[vAlign]} height="inherit">
      {children}
    </Stack>
  );
};

export default GenericLayout;
