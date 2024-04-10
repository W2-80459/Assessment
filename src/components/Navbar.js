import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = () => {
    const role = localStorage.getItem('role');

    const handleLogout = () => {

        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Ticket Management System
                </Typography>
                {role == "0" && (
                    <>
                        <Button color="inherit" component={RouterLink} to="/home">
                            Home
                        </Button>
                        <Button color="inherit" component={RouterLink} to="/create-ticket">
                            Create Ticket
                        </Button>
                        {/* <Button color="inherit" component={RouterLink} to="/tickets">
                            Ticket List
                        </Button> */}
                    </>
                )}
                {role == "1" && (
                    <Button color="inherit" component={RouterLink} to="/tech-support-dashboard">
                        Tech Support Dashboard
                    </Button>
                )}
                {role == "2" && (
                    <>
                        <Button color="inherit" component={RouterLink} to="/admin-dashboard">
                            Admin Dashboard
                        </Button>
                        <Button color="inherit" component={RouterLink} to="/admin-tickets">
                            Admin Tickets
                        </Button>
                    </>
                )}
                <Button color="inherit" onClick={handleLogout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
