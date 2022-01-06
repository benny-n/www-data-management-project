import { LoadingButton } from "@mui/lab";
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
import { useQuery } from "react-query";
import { register } from "../api";
import { UserContext } from "../App";
import { FormDialogProps } from "./AppMenu";

const AddAdminForm: React.FC<FormDialogProps> = (props) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [usernameError, setUsernameError] = React.useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
  const [registerTrigger, setRegisterTrigger] = React.useState(false);
  const { basicAuth } = React.useContext(UserContext);
  const { status } = useQuery(
    "register",
    () => register(username, password, basicAuth),
    {
      enabled: registerTrigger,
      retry: false,
    }
  );

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

  const handleClickRegister = () => {
    // setUsernameEmptyError(username === "");
    // setPasswordEmptyError(password === "");
    if (!password || !username) return;
    setRegisterTrigger(true);
  };

  React.useEffect(() => {
    if (status === "error") {
      //TODO set error state
      console.log("error");
      setRegisterTrigger(false);
    } else if (status === "success") {
      setRegisterTrigger(false);
      props.onClose();
      console.log("success");
    }
  }, [status, props]);

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: 2,
          }}
          id="admin-form"
          onSubmit={handleClickRegister}
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
        <LoadingButton
          type="submit"
          form={props.formId}
          size="medium"
          onClick={handleClickRegister}
          loading={status === "loading"}
          variant="contained"
        >
          Submit
        </LoadingButton>
        <Button size="medium" variant="contained" onClick={props.onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAdminForm;
