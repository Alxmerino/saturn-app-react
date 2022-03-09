import React from 'react';
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';

const theme = createTheme();

interface BaseLayoutProps {
  children: JSX.Element;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
}: BaseLayoutProps): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          height: '100vh',
        }}
      >
        <CssBaseline />
        {children}
      </Container>
    </ThemeProvider>
  );
};

export default BaseLayout;
