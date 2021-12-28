import { AccountCircle, Password } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField } from "@mui/material"
import React from "react";

const RegisterForm: React.FC = () => {

  const [open, setOpen] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [usernameError, setUsernameError] = React.useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setUsernameError(event.target.value === 'bad-username')
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setConfirmPasswordError(event.target.value !== confirmPassword);
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
    setConfirmPasswordError(event.target.value !== password);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    //TODO remove this log
    console.log("REGISTER FORM SAYS:", 'Username:', username, 'Password: ', password); 
  };

    return(
      <div style={{width: '100%'}} >
        <Button 
          sx={{width: '100%'}} 
          form="register-form"
          size="large" 
          variant="contained"
          onClick={handleClickOpen}
        >
          SIGN UP
        </Button>
          <Dialog open={open} onClose={handleClose} fullWidth >
            <DialogTitle>Registration</DialogTitle >
            <DialogContent >
            <form 
              id="register-form" 
              onSubmit={handleSubmit}
              style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 2}}
            >
              <TextField 
                error={usernameError}
                sx={{marginTop: 5}}
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
            </form>  
            </DialogContent>
            <DialogActions>
                <Button type="submit" form="register-form" size="medium" variant="contained">Submit</Button>
                <Button size="medium" variant="contained" onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </Dialog>   
      </div>
    )
}

export default RegisterForm;
