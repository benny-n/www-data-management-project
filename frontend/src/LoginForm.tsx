import { AccountCircle, Password } from "@mui/icons-material";
import { Box, Button, InputAdornment, TextField } from "@mui/material"
import React from "react";
import RegisterForm from "./RegisterForm";

const LoginForm: React.FC = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    //TODO remove this log
    console.log("LOGIN FORM SAYS:", 'Username:', username, 'Password: ', password); 
  };
    
  return(
    <div>
      <Box
        component="form"
        sx={{
          width: '30%', 
          minWidth: '500px', 
          height: '50%',
          display: 'flex',
          flexDirection: 'column',
          p: 5,
          m: 5,
          marginBottom: 1,
          paddingBottom: 1,
          gap: 2,
          bgcolor: 'secondary',
        }}
        id="login-form"
        onSubmit={handleSubmit}
      > 
        <TextField 
          label="Username" 
          variant="filled"
          value={username}
          onChange={handleUsernameChange}
          autoComplete="username"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }} 
        />
        <TextField 
          label="Password" 
          variant="filled"
          type="password"
          value={password}
          onChange={handlePasswordChange} 
          autoComplete="current-password"
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
          display: 'flex',
          flexDirection: 'column',
          p: 5,
          m: 5,
          marginTop: 0,
          paddingTop: 0,
          gap: 2,
          bgcolor: 'secondary',
        }}
      > 
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'space-between', gap: 5 }}>
          <Button type="submit" form="login-form" sx={{width: '80%'}} size="large" variant="contained">LOGIN</Button>
          <RegisterForm />
        </div>
      </Box>
    </div>
  )
}

export default LoginForm;
