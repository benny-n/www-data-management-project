import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
import AddAdminForm from "./AddAdminForm";

export interface AddAdminDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddAdminDialog: React.FC<AddAdminDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Registration</DialogTitle>
      <DialogContent>
        <AddAdminForm />
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          form="admin-form"
          size="medium"
          variant="contained"
        >
          Submit
        </Button>
        <Button size="medium" variant="contained" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAdminDialog;
