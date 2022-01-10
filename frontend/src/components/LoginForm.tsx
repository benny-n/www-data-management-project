import { AccountCircle, Password } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, InputAdornment, TextField } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { login } from "../api";
import { UserContext } from "../App";

const LoginForm: React.FC = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [usernameEmptyError, setUsernameEmptyError] = React.useState(false);
  const [passwordEmptyError, setPasswordEmptyError] = React.useState(false);
  const [loginTrigger, setLoginTrigger] = React.useState(false);
  const { setUserContext } = React.useContext(UserContext);
  const { status } = useQuery("login", () => login(username, password), {
    enabled: loginTrigger,
    retry: false,
  });
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleClickLogin = (event: any) => {
    event.preventDefault();
    setUsernameEmptyError(username === "");
    setPasswordEmptyError(password === "");
    if (!password || !username) return;
    setLoginTrigger(true);
  };

  React.useEffect(() => {
    if (status === "error") {
      setLoginTrigger(false);
    } else if (status === "success") {
      setLoginTrigger(false);
      const basicAuth = window.btoa(`${username}:${password}`);
      localStorage.setItem("basicAuth", basicAuth);
      setUserContext(basicAuth);
      window.location.reload();
    }
  }, [status, username, password, setUserContext]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box
        component="form"
        sx={{
          width: "30%",
          minWidth: "500px",
          height: "50%",
          display: "flex",
          flexDirection: "column",
          p: 5,
          m: 5,
          marginBottom: 1,
          paddingBottom: 1,
          gap: 2,
          bgcolor: "secondary",
        }}
        id="login-form"
        onSubmit={handleClickLogin}
      >
        <TextField
          error={usernameEmptyError || status === "error"}
          label="Username"
          variant="filled"
          value={username}
          onChange={handleUsernameChange}
          autoComplete="username"
          helperText={usernameEmptyError ? "Please enter a username." : ""}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          error={passwordEmptyError || status === "error"}
          label="Password"
          variant="filled"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          autoComplete="current-password"
          helperText={
            passwordEmptyError
              ? "Please enter a password."
              : status === "error"
              ? "Incorrect username or password!"
              : ""
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Password />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 5,
          m: 5,
          marginTop: 0,
          paddingTop: 0,
          gap: 2,
          bgcolor: "secondary",
        }}
      >
        <LoadingButton
          type="submit"
          form="login-form"
          sx={{ width: "50%" }}
          size="large"
          onClick={handleClickLogin}
          loading={status === "loading"}
          variant="contained"
        >
          Login
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default LoginForm;
