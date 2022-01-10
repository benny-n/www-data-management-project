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

enum UsernameError {
  None,
  Empty,
  FirstCharDigit,
  ContainsSpecialChars,
}

const passwordMinLength = 5;
enum PasswordError {
  None,
  TooShort,
  DoNotMatch,
}

const AddAdminForm: React.FC<FormDialogProps> = (props) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [passwordError, setPasswordError] = React.useState(PasswordError.None);
  const [usernameError, setUsernameError] = React.useState(UsernameError.None);

  const [registerTrigger, setRegisterTrigger] = React.useState(false);
  const { basicAuth } = React.useContext(UserContext);
  const { status } = useQuery(
    "register",
    () => register(username, password, basicAuth!!),
    {
      enabled: registerTrigger,
      retry: false,
    }
  );

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    !event.target.value
      ? setUsernameError(UsernameError.Empty)
      : !event.target.value.charAt(0).match(/[a-z]/i)
      ? setUsernameError(UsernameError.FirstCharDigit)
      : !event.target.value.match(/^[a-z0-9]*$/i)
      ? setUsernameError(UsernameError.ContainsSpecialChars)
      : setUsernameError(UsernameError.None);
    setUsername(event.target.value);
  };

  const usernameHelperText = () => {
    switch (usernameError) {
      case UsernameError.Empty:
        return "Username can not be empty.";
      case UsernameError.FirstCharDigit:
        return "First character of username must be a letter.";
      case UsernameError.ContainsSpecialChars:
        return "Username must contain only letters and digits.";
      case UsernameError.None:
        return "";
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value.length < passwordMinLength
      ? setPasswordError(PasswordError.TooShort)
      : event.target.value !== confirmPassword
      ? setPasswordError(PasswordError.DoNotMatch)
      : setPasswordError(PasswordError.None);
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.target.value !== password
      ? setPasswordError(PasswordError.DoNotMatch)
      : setPasswordError(PasswordError.None);
    setConfirmPassword(event.target.value);
  };

  const handleClickRegister = () => {
    setRegisterTrigger(true);
  };

  const handleClickCancel = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setUsernameError(UsernameError.None);
    setPasswordError(PasswordError.None);
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
            error={usernameError !== UsernameError.None}
            sx={{ marginTop: 5 }}
            label="Username"
            variant="outlined"
            value={username}
            onChange={handleUsernameChange}
            autoComplete="username"
            helperText={usernameHelperText()}
          />
          <TextField
            error={passwordError !== PasswordError.None}
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="new-password"
            helperText={
              passwordError === PasswordError.TooShort
                ? "Password must be at least 5 characters."
                : ""
            }
          />
          <TextField
            error={passwordError !== PasswordError.None}
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            autoComplete="new-password"
            helperText={
              passwordError === PasswordError.DoNotMatch
                ? "Passwords don't match."
                : ""
            }
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
          disabled={
            passwordError !== PasswordError.None ||
            usernameError !== UsernameError.None
          }
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
