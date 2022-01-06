import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ThemeButton from "./ThemeButton";
import React from "react";
import AppMenu, { AppMenuProps } from "./AppMenu";
import { UserContext } from "../App";

const drawerWidth = 240;

const NavBar: React.FC<{ loggedIn: boolean }> = ({ loggedIn }) => {
  const theme = useTheme();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const appMenuProps: AppMenuProps = {
    open: menuOpen,
    onClose: () => setMenuOpen(false),
  };

  const { username } = React.useContext(UserContext);

  return (
    <Box
      sx={{ flexGrow: 1, display: "flex" }}
      {...(menuOpen && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      })}
    >
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Tooltip
            title={loggedIn ? "" : "You have to be logged in to use the menu"}
            TransitionComponent={Zoom}
          >
            <span>
              <IconButton
                disabled={!loggedIn}
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
            component="div"
            color="text.primary"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            Hi {username}, Welcome to Telegram Polls!
          </Typography>
          <Box
            sx={{ flexGrow: 1, display: "flex", flexDirection: "row-reverse" }}
          >
            <ThemeButton />
          </Box>
        </Toolbar>
      </AppBar>
      <AppMenu {...appMenuProps} />
    </Box>
  );
};

export default NavBar;
