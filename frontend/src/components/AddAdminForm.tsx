import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React from "react";

export interface AddAdminFormProps {
  open: boolean;
  onClose: () => void;
}

const AddAdminForm: React.FC<AddAdminFormProps> = ({ open, onClose }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [usernameError, setUsernameError] = React.useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setUsernameError(event.target.value === "bad-username");
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setConfirmPasswordError(event.target.value !== confirmPassword);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
    setConfirmPasswordError(event.target.value !== password);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    //TODO remove this log
    console.log(
      "REGISTER FORM SAYS:",
      "Username:",
      username,
      "Password: ",
      password
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Registration</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: 2,
          }}
          id="register-form"
          onSubmit={handleSubmit}
        >
          <TextField
            error={usernameError}
            sx={{ marginTop: 5 }}
            label="Username"
            variant="outlined"
            value={username}
            onChange={handleUsernameChange}
            autoComplete="username"
          />
          <TextField
            error={confirmPasswordError}
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="new-password"
          />
          <TextField
            error={confirmPasswordError}
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            autoComplete="new-password"
            helperText={confirmPasswordError ? "Passwords don't match." : ""}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          form="register-form"
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

export default AddAdminForm;
