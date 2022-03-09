import React from 'react';
import { Container, Stack } from '@mui/material';

interface GenericLayoutProps extends Record<string, unknown> {
  vAlign?: string;
  children: JSX.Element | JSX.Element[];
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined;
}

const GenericLayout = ({
  vAlign = 'top',
  children,
  maxWidth,
}: GenericLayoutProps): JSX.Element => {
  const vAlignMap: Record<string, string> = {
    top: 'flex-start',
    center: 'center',
    bottom: 'flex-end',
  };

  return (
    <Stack justifyContent={vAlignMap[vAlign]} height="inherit">
      {maxWidth !== null ? (
        <Container maxWidth={maxWidth}>{children}</Container>
      ) : (
        { children }
      )}
    </Stack>
  );
};

export default GenericLayout;
