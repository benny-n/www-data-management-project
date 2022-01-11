import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import React from "react";
import { UserContext } from "../App";
import AppMenu, { AppMenuProps } from "./AppMenu";
import ThemeButton from "./ThemeButton";
import RefreshIcon from "@mui/icons-material/Refresh";
export interface NavBarProps {
  menuOpen: boolean;
  setMenuOpen: (_: boolean) => void;
  setRefresh: (_: boolean) => void;
}

const NavBar: React.FC<NavBarProps> = ({
  menuOpen,
  setMenuOpen,
  setRefresh,
}) => {
  const appMenuProps: AppMenuProps = {
    open: menuOpen,
    onClose: () => setMenuOpen(false),
  };

  const { username } = React.useContext(UserContext);

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Tooltip
            title={
              username
                ? "Main menu "
                : "You have to be logged in to use the menu"
            }
            TransitionComponent={Zoom}
          >
            <span>
              <IconButton
                disabled={!username}
                color="inherit"
                aria-label="open drawer"
                onClick={() => setMenuOpen(true)}
                edge="start"
                sx={{ mr: 2, ...(menuOpen && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Typography
            variant="h6"
            noWrap
            fontWeight="bold"
            component="div"
            color="#ffffff"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            Hi {username}, Welcome to Telegram Polls!
          </Typography>
          <Box
            sx={{ flexGrow: 1, display: "flex", flexDirection: "row-reverse" }}
          >
            <ThemeButton />
            <IconButton onClick={() => setRefresh(true)}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <AppMenu {...appMenuProps} />
    </Box>
  );
};

export default NavBar;
