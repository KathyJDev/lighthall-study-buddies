import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { db } from '../../../firebase-config.js';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const theme = createTheme({
  palette: {
    primary: {
      main: '#28306D',
    },
  },
});

const LoginButton = styled(Button)({
  textTransform: 'none',
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      navigateToDashboard();
    } catch (err) {
      setError(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setError(false);
  };

  function navigateToDashboard() {
    window.location.href = `/dashboard`;
  };

  const navigateToRegister = () => {
    window.location.href = '/register';
  };

  return (
    <div className='login-box'>
        <h1>Login</h1>
        <span>Welcome back!</span>
        <ThemeProvider theme={theme}>
        <Box
            component="form"
            sx={{ mt: 3, ml: 1, mb: 4}}
            noValidate
            autoComplete="off"
        >

            <FormControl required fullWidth margin="normal">
            <InputLabel htmlFor="standard-adornment-password">Email</InputLabel>
            <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                color="primary"
            />
            </FormControl>

            <FormControl required fullWidth margin="normal">
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                <InputAdornment position="end">
                    <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
                }
            />
            </FormControl>

            <LoginButton sx={{mt: 2, backgroundColor: '#28306D', '&:hover': {backgroundColor: '#418BF6'} }} variant="contained" onClick={handleLogin}>Login</LoginButton>
        </Box>
        <Divider varient="middle">OR</Divider>
        <Box sx={{  mt: 3, ml: 1, mb: 1, color: '#28306D'}}>
            <h3>Need an account?</h3>
            <LoginButton onClick={navigateToRegister} sx={{mt: 2, backgroundColor: '#28306D', '&:hover': {backgroundColor: '#418BF6'} }} variant="contained">Register</LoginButton>
        </Box>
        </ThemeProvider>
        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={error} onClose={handleClose} autoHideDuration={4000}>
          <Alert severity="error">Error signing in</Alert>
        </Snackbar>
    </div>
  )
}

export default Login