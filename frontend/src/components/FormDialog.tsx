import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

export interface FormDialogProps {
  title: string;
  formId: string;
  open: boolean;
  onClose: () => void;
  component: React.FC;
}

const FormDialog: React.FC<FormDialogProps> = (props) => {
  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <props.component />
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          form={props.formId}
          size="medium"
          variant="contained"
        >
          Submit
        </Button>
        <Button size="medium" variant="contained" onClick={props.onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;
