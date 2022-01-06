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
import AddAdminForm from "./AddAdminForm";
import { logout } from "../api";
import { UserContext } from "../App";
import AddPollForm from "./AddPollForm";

const drawerWidth = 240;

export interface FormDialogProps {
  title: string;
  formId: string;
  open: boolean;
  onClose: () => void;
}

export interface AppMenuProps {
  open: boolean;
  onClose: () => void;
}

const AppMenu: React.FC<AppMenuProps> = ({ open, onClose }) => {
  const [addAdminDialogOpen, setAddAdminDialogOpen] = React.useState(false);
  const [addPollDialogOpen, setAddPollDialogOpen] = React.useState(false);

  const { setUserContext } = React.useContext(UserContext);

  const addAdminFormProps: FormDialogProps = {
    title: "Register a new admin",
    formId: "admin-form",
    open: addAdminDialogOpen,
    onClose: () => setAddAdminDialogOpen(false),
  };

  const addPollFormProps: FormDialogProps = {
    title: "Create a new poll",
    formId: "poll-form",
    open: addPollDialogOpen,
    onClose: () => setAddPollDialogOpen(false),
  };

  const handleLogout = () => {
    localStorage.removeItem("basicAuth");
    logout();
    setUserContext("");
    window.location.reload();
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
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
        <AddAdminForm {...addAdminFormProps} />
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
        <AddPollForm {...addPollFormProps} />
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
