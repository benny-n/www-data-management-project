import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PollIcon from "@mui/icons-material/Poll";
import LogoutIcon from "@mui/icons-material/Logout";
import React from "react";
import FormDialog, { FormDialogProps } from "./FormDialog";
import AddAdminForm from "./AddAdminForm";
import { logout } from "../api";
import { UserContext } from "../App";
import AddPollForm from "./AddPollForm";

const drawerWidth = 240;

export interface AppMenuProps {
  open: boolean;
  onClose: () => void;
}

const AppMenu: React.FC<AppMenuProps> = ({ open, onClose }) => {
  const [addAdminDialogOpen, setAddAdminDialogOpen] = React.useState(false);
  const [addPollDialogOpen, setAddPollDialogOpen] = React.useState(false);

  const { setLoggedIn, setUsername } = React.useContext(UserContext);

  const addAdminDialogProps: FormDialogProps = {
    title: "Register a new admin",
    formId: "admin-form",
    open: addAdminDialogOpen,
    onClose: () => setAddAdminDialogOpen(false),
    component: AddAdminForm,
  };

  const addPollDialogProps: FormDialogProps = {
    title: "Create a new poll",
    formId: "poll-form",
    open: addPollDialogOpen,
    onClose: () => setAddPollDialogOpen(false),
    component: AddPollForm,
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    logout();
    setLoggedIn(false);
    setUsername("");
    window.location.reload();
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        bgcolor: "background.paper",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 1,
        }}
      >
        <Typography variant="h6">Menu</Typography>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem
          button
          key="Add new admin"
          onClick={() => setAddAdminDialogOpen(true)}
        >
          <ListItemIcon>
            <SupervisorAccountIcon />
          </ListItemIcon>
          <ListItemText primary="Add new admin" />
        </ListItem>
        <FormDialog {...addAdminDialogProps} />
        <ListItem
          button
          key="Create poll"
          onClick={() => setAddPollDialogOpen(true)}
        >
          <ListItemIcon>
            <PollIcon />
          </ListItemIcon>
          <ListItemText primary="Create poll" />
        </ListItem>
        <FormDialog {...addPollDialogProps} />
        <ListItem button key="Logout" onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
      <Divider />
    </Drawer>
  );
};

export default AppMenu;
