import { ExpandLess, ExpandMore } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import PollIcon from "@mui/icons-material/Poll";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { getAllAdmins, logout } from "../api";
import { UserContext } from "../App";
import AddAdminForm from "./AddAdminForm";
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
  const [adminListOpen, setAdminListOpen] = React.useState(true);
  const [addAdminDialogOpen, setAddAdminDialogOpen] = React.useState(false);
  const [addPollDialogOpen, setAddPollDialogOpen] = React.useState(false);
  const { basicAuth } = React.useContext(UserContext);
  const { data, status, remove } = useQuery("get-all-admins", () =>
    getAllAdmins(basicAuth!!)
  );

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

  const handleClick = () => {
    //TODO rename
    setAdminListOpen(!adminListOpen);
  };

  React.useEffect(() => {
    remove();
  }, [addAdminDialogOpen, remove]);

  const handleLogout = () => {
    localStorage.removeItem("basicAuth");
    logout();
    setUserContext(null);
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
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <SupervisorAccountIcon />
          </ListItemIcon>
          <ListItemText primary="Admins" />
          {adminListOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse
          sx={{
            width: "80%",
            marginLeft: 3,
            gap: 0,
          }}
          in={adminListOpen}
          timeout="auto"
        >
          <List component="div" disablePadding>
            {status === "success"
              ? data!!.admins.map((username, index) => (
                  <ListItem
                    key={index}
                    sx={{ gap: 2, paddingTop: 0, paddingBottom: 0 }}
                  >
                    <Typography fontSize="25px">•</Typography>
                    <Typography>{username}</Typography>
                  </ListItem>
                ))
              : [0, 1].map((index) => <Skeleton key={index} />)}
          </List>
        </Collapse>
        <ListItem
          button
          key="Add new admin"
          onClick={() => setAddAdminDialogOpen(true)}
        >
          <ListItemIcon>
            <GroupAddIcon />
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
