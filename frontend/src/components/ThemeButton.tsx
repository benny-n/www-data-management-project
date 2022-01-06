import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { ColorModeContext } from "../App";
import React from "react";

const ThemeButton: React.FC = () => {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  return (
    <IconButton
      size="large"
      onClick={colorMode.toggleColorMode}
      color="default"
    >
      {theme.palette.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
};

export default ThemeButton;
