import React from 'react';
import './App.css';
import './theme'
import {CssBaseline, styled, ThemeProvider} from '@mui/material'
import NavBar from './NavBar';
import LoginForm from './LoginForm';
import { getAppTheme } from './theme';
import RegisterForm from './RegisterForm';

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {

  return (
      <div>
        <NavBar />
        <LayoutWrapper>
          <LoginForm />
        </LayoutWrapper>
      </div>
  );
}

export default function ToggleColorMode() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

const LayoutWrapper = styled('div')`
  display: flex;
  align-items: center;
  flex-direction: column;
`;