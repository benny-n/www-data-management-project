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
  const passwordMinLength: number = 5;
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
  const [lengthPasswordError, setlengthPasswordError] = React.useState(false);
  const [firstCharLetterError, setfirstCharLetterError] = React.useState(false);
  const [specialCharactersError, setSpecialCharactersError] = React.useState(false);
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
    setfirstCharLetterError(!(event.target.value.charAt(0).match(/[a-z]/i)));
    setSpecialCharactersError(!(event.target.value.match(/^[a-z0-9]*$/i)));
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setlengthPasswordError(event.target.value.length < passwordMinLength);
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
    // if (!password || !username) return;
    setRegisterTrigger(true);
  };

  const handleClickCancel = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setConfirmPasswordError(false);
    setlengthPasswordError(false);
    setfirstCharLetterError(false);
    setSpecialCharactersError(false);
    props.onClose();
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
            error={firstCharLetterError || specialCharactersError}
            sx={{ marginTop: 5 }}
            label="Username"
            variant="outlined"
            value={username}
            onChange={handleUsernameChange}
            autoComplete="username"
            helperText={firstCharLetterError ? "First character of username must be a letter." : 
                        (specialCharactersError ? "Username must contain only letters and digits." : "")}
          />
          <TextField
            error={confirmPasswordError || lengthPasswordError}
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="new-password"
            helperText={lengthPasswordError ? "Password must be at least 5 characters." : ""}
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
          disabled={!username || !password || confirmPasswordError || firstCharLetterError || specialCharactersError || lengthPasswordError}
        >
          Submit
        </LoadingButton>
        <Button size="medium" variant="contained" onClick={handleClickCancel}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAdminForm;
