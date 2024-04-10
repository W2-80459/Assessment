import React, { useState } from 'react';
import { Typography, Button, TextField, Container, Grid, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import './loginStyles.css'; 
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });
            const { token, userId, role } = response.data; 
            
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('role', role);
            
            switch (role) {
                case 0:
                    navigate('/home');
                    break;
                case 1:
                    navigate('/tech-support-dashboard');
                    break;
                case 2:
                    navigate('/admin-dashboard');
                    break;
                default:
                    navigate('/home');
            }
        } catch (error) {
            console.error('Login failed:', error);
            
        }
    };

    return (
        <Container component="main" maxWidth="xs" className="container"> 
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <form className="form" onSubmit={handleSubmit}> 
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className="submit"
                >
                    Sign In
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        
                        <Link variant="body2" onClick={() => navigate('/register')}>
                            Register Here
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default Login;
