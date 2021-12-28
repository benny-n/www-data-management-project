import { AccountCircle, Password } from "@mui/icons-material";
import { Box, Button, InputAdornment, TextField } from "@mui/material"
import React from "react";

const LoginBox: React.FC = () => {
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
    console.log( 'Username:', username, 'Password: ', password); 
  };
    return(
      <form 
        onSubmit={handleSubmit}
        style={{ 
          width: '30%', 
          minWidth: '500px', 
          height: '50%', 
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 5,
            m: 5,
            gap: 2,
            bgcolor: 'secondary',
          }}
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
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'space-between', gap: 5 }}>
            <Button type="submit" sx={{width: '100%'}} size="large" variant="contained">LOGIN</Button>
            <Button sx={{width: '100%'}} size="large" variant="contained">SIGN UP</Button>
          </div>
        </Box>
      </form>
    )
}

export default LoginBox;
