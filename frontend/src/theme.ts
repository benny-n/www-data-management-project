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
          primary: green,
          secondary: grey,
          divider: green[700],
          background: {
            default: grey[800],
            paper: green[800],
          },
          text: {
            primary: '#fff',
            secondary: grey[500],
          },
        }),
    },
  });
  theme = responsiveFontSizes(theme);
  return theme;
};