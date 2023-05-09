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
import { db } from '../../firebase-config.js';
import { collection, addDoc } from 'firebase/firestore';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [uniqueId, setUniqueId] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        // Check if password and passwordConfirm match
        if (password !== passwordConfirm) {
          alert('Passwords do not match');
          return;
        }
        try {
          // Add a new user document to the "users" collection with the input values
          const docRef = await addDoc(collection(db, 'users'), {
            username: username,
            email: email,
            password: password
          });
          alert('Registration successful');
          setUniqueId(docRef.id);
          await navigateToDashboard(docRef.id);
        } catch (error) {
          console.error('Error adding document: ', error);
        }
    };
    
    async function navigateToDashboard(id) {
        window.location.href = `/dashboard/${id}`;
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  return (
    <div className='login-box'>
        <h1>Register</h1>
        <span>Join the community</span>
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
            <Button sx={{mt: 2, backgroundColor: '#28306D', '&:hover': {backgroundColor: '#E94A47'} }} variant="contained" onClick={handleRegister}>Register</Button>
        </Box>
        <Divider varient="middle">OR</Divider>
        <Box sx={{  mt: 3, ml: 1, mb: 1, color: '#28306D'}}>
            <h3>Already have an account?</h3>
            <Button sx={{mt: 2, backgroundColor: '#28306D', '&:hover': {backgroundColor: '#E94A47'} }} variant="contained">Login</Button>
        </Box>
    </div>
  )
}

export default Login