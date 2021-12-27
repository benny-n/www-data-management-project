import React from 'react';
import './App.css';
import './theme'
import {Box, Container, createTheme, CssBaseline, ThemeProvider, useTheme} from '@mui/material'
import NavBar from './NavBar';
import { getAppTheme } from './theme';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {
  
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <NavBar theme={theme} colorMode={colorMode} />
    </Box>
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