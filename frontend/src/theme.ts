import { createTheme, PaletteMode, responsiveFontSizes } from '@mui/material';
import { green, grey, lightGreen } from '@mui/material/colors';

export const getAppTheme = (mode: PaletteMode) => {
  let theme = createTheme({
    palette: {
      mode,
      ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: lightGreen,
          secondary: grey,
          divider: lightGreen[200],
          text: {
            primary: grey[800],
            secondary: grey[800],
          },
          background: {
            default: grey[300],
            paper: grey[300],
          },
        }
      : {
          // palette values for dark mode
          primary: {
              main: green[700],
              light: green[500],
              dark: green[900],
          },
          secondary: grey,
          divider: green[900],
          text: {
            primary: '#fff',
            secondary: grey[500],
          },
          background: {
            default: grey[800],
            paper: grey[800],
          },
        }),
    },
  });
  theme = responsiveFontSizes(theme);
  return theme;
};