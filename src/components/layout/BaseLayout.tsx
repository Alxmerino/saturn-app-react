import React from 'react';
import { CssBaseline } from '@mui/material';

interface BaseLayoutProps {
  children: JSX.Element;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
}: BaseLayoutProps): JSX.Element => {
  return (
    <>
      <CssBaseline />
      {children}
    </>
  );
};

export default BaseLayout;
