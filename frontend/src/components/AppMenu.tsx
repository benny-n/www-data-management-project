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
import AddAdminForm, { AddAdminFormProps } from "./AddAdminForm";

const drawerWidth = 240;

export interface AppMenuProps {
  open: boolean;
  onClose: () => void;
}

const AppMenu: React.FC<AppMenuProps> = ({ open, onClose }) => {
  const [addAdminDialogOpen, setAddAdminDialogOpen] = React.useState(false);
  const [addPollDialogOpen, setAddPollDialogOpen] = React.useState(false);

  const addAdminDialogProps: AddAdminFormProps = {
    open: addAdminDialogOpen,
    onClose: () => setAddAdminDialogOpen(false),
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
        <AddAdminForm {...addAdminDialogProps} />
        <ListItem button key="Create poll">
          <ListItemIcon>
            <PollIcon />
          </ListItemIcon>
          <ListItemText primary="Create poll" />
        </ListItem>
        <ListItem button key="Logout">
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
