import React, { useState } from 'react';
import { Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('end_user');

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
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
    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4">Register</Typography>
      <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <TextField type="password" label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

      <FormControl fullWidth>
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

      <Button type="submit" variant="contained" color="primary">Register</Button>
    </form>
  );
};

export default Registration;
