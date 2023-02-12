import React from 'react';
import {
  colors,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';

const theme = createTheme({
  palette: {
    blue: colors.blue,
  },
});

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
          minWidth: '450px',
        }}
      >
        <CssBaseline />
        {children}
      </Container>
    </ThemeProvider>
  );
};

export default BaseLayout;
