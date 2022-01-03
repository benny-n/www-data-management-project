import { AccountCircle, Password } from "@mui/icons-material";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import React from "react";

const LoginForm: React.FC = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [usernameEmptyError, setUsernameEmptyError] = React.useState(false);
  const [passwordEmptyError, setPasswordEmptyError] = React.useState(false);
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    setUsernameEmptyError(username === "");
    setPasswordEmptyError(password === "");
    if (!password || !username) return;
    //TODO remove this log
    console.log(
      "LOGIN FORM SAYS:",
      "Username:",
      username,
      "Password: ",
      password
    );
  };

  return (
    <div>
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
        onSubmit={handleSubmit}
      >
        <TextField
          error={usernameEmptyError}
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
          error={passwordEmptyError}
          label="Password"
          variant="filled"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          autoComplete="current-password"
          helperText={passwordEmptyError ? "Please enter a password." : ""}
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
        <Button
          type="submit"
          form="login-form"
          sx={{ width: "50%" }}
          size="large"
          variant="contained"
        >
          LOGIN
        </Button>
      </Box>
    </div>
  );
};

export default LoginForm;
