import { createTheme, PaletteMode, responsiveFontSizes } from "@mui/material";
import { blue, grey, lightBlue } from "@mui/material/colors";

export const getAppTheme = (mode: PaletteMode) => {
  let theme = createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // palette values for light mode
            primary: {
              main: lightBlue[700],
              light: lightBlue[500],
              dark: lightBlue[900],
            },
            secondary: grey,
            divider: lightBlue[500],
            text: {
              primary: grey[900],
              secondary: grey[600],
            },
            background: {
              default: grey[300],
              paper: "#d8d8d8",
            },
          }
        : {
            // palette values for dark mode
            primary: {
              main: blue[700],
              light: blue[500],
              dark: blue[900],
            },
            secondary: grey,
            divider: blue[900],
            text: {
              primary: "#fff",
              secondary: grey[500],
            },
            background: {
              default: grey[800],
              paper: grey[900],
            },
          }),
    },
  });
  theme = responsiveFontSizes(theme);
  return theme;
};
