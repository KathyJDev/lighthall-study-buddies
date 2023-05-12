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
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [showPasswordSnackbar, setShowPasswordSnackbar] = useState(false);
    const [showEmailSnackbar, setShowEmailSnackbar] = useState(false);
    const [showRegisterSnackbar, setShowRegisterSnackbar] = useState(false);
    const [showUsernameSnackbar, setShowUsernameSnackbar] = useState(false);

    const userRef = collection(db, 'users');

    const handleRegister = async (e) => {
      e.preventDefault();
      // Check if password and passwordConfirm match
      if (password !== passwordConfirm) {
        setShowPasswordSnackbar(true);
        return;
      }
      try {
        // Check if the username is already taken
        const q = query(userRef, where('username', '==', username));
        const usernameExists = await getDocs(q);
        if (usernameExists.docs.length > 0) {
          setShowUsernameSnackbar(true);
          return;
        }
    
        const auth = getAuth();
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        const userDoc = {
          username: username,
          email: email,
          uid: user.uid,
        };
        // Add a new user document to the "users" collection with the input values
        await setDoc(doc(userRef, user.uid), userDoc);
        setShowRegisterSnackbar(true);
        navigateToDashboard(user.uid);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          setShowEmailSnackbar(true);
        } else {
          console.error('Error registering user: ', error);
        }
      }
    };

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      if (showPasswordSnackbar) setShowPasswordSnackbar(false);
      if (showEmailSnackbar) setShowEmailSnackbar(false);
      if (showRegisterSnackbar) setShowRegisterSnackbar(false);
      if (showUsernameSnackbar) setShowUsernameSnackbar(false);  
    };
    
    function navigateToDashboard() {
        window.location.href = `/dashboard`;
    }

    function navigateToLogin() {
        window.location.href = '/login';
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  return (
    <div className='login-box'>
        <h1>Register</h1>
        <span>Join the community</span>
        <ThemeProvider theme={theme}>
        <Box
            component="form"
            sx={{ mt: 3, ml: 1, mb: 4}}
            noValidate
            autoComplete="off"
        >
            <FormControl required fullWidth margin="normal">
            <InputLabel htmlFor="standard-adornment-password">Username</InputLabel>
            <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            </FormControl>

            <FormControl required fullWidth margin="normal">
            <InputLabel htmlFor="standard-adornment-password">Email</InputLabel>
            <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <FormControl required fullWidth margin="normal">
            <InputLabel htmlFor="password-confirm">Confirm Password</InputLabel>
            <Input
                id="standard-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
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
            <LoginButton sx={{mt: 2, backgroundColor: '#28306D', '&:hover': {backgroundColor: '#418BF6'} }} variant="contained" onClick={handleRegister}>Register</LoginButton>
        </Box>
        <Divider varient="middle">OR</Divider>
        <Box sx={{  mt: 3, ml: 1, mb: 1, color: '#28306D'}}>
            <h3>Already have an account?</h3>
            <LoginButton onClick={navigateToLogin} sx={{mt: 2, backgroundColor: '#28306D', '&:hover': {backgroundColor: '#418BF6'} }} variant="contained">Login</LoginButton>
        </Box>
        </ThemeProvider>
        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={showPasswordSnackbar} onClose={handleClose} autoHideDuration={4000}>
          <Alert severity="error">Passwords do not match</Alert>
        </Snackbar>
        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={showEmailSnackbar} onClose={handleClose} autoHideDuration={4000}>
          <Alert severity="error">An account with this email already exists</Alert>
        </Snackbar>
        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={showRegisterSnackbar} onClose={handleClose} autoHideDuration={4000}>
          <Alert severity="success">Registration successful</Alert>
        </Snackbar>
        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={showUsernameSnackbar} onClose={handleClose} autoHideDuration={4000}>
          <Alert severity="error">Username already taken</Alert>
        </Snackbar>
    </div>
  )
}

export default Register