import React, { useState } from 'react';
import { Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('end_user');
  const [passwordError, setPasswordError] = useState(false); 
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError(true); 
      return;
    } else {
      setPasswordError(false); 
    }

    const userData = {
      email: email,
      password: password,
      role: role
    };

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      console.log('User registered successfully');

      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('end_user');
      alert('User successfully Registered!');
      navigate('/');
    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={6}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" align="center" gutterBottom>Register</Typography>
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField type="password" label="Password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
          <TextField type="password" label="Confirm Password" fullWidth margin="normal" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          
         
          {passwordError && (
            <Alert severity="error" variant="outlined">Passwords do not match</Alert>
          )}

          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="end_user">End User</MenuItem>
              <MenuItem value="tech_support">Tech Support</MenuItem>
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" color="primary" fullWidth>Register</Button>
        </form>
      </Grid>
    </Grid>
  );
};

export default Registration;
