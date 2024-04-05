import React, { useState, useEffect } from 'react';
import { Typography, Button, Drawer, List, ListItem, ListItemText, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios'; 

const Home = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        
        const fetchTickets = async () => {
            try {
                
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    throw new Error('User ID not found in local storage');
                }

                const response = await fetch(`http://localhost:5000/api/tickets?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tickets');
                }
                const data = await response.json();
                setTickets(data);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };

        fetchTickets(); 
    }, []); 

    const handleMarkAsClosed = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/tickets/close/${id}`);
            
            setTickets(prevTickets => prevTickets.map(ticket => {
                if (ticket.id === id) {
                    return { ...ticket, status: 'Closed' };
                }
                return ticket;
            }));
        } catch (error) {
            console.error('Error marking ticket as closed:', error);
        }
    };

    const handleMarkAsResolved = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/tickets/resolve/${id}`);
            
            setTickets(prevTickets => prevTickets.map(ticket => {
                if (ticket.id === id) {
                    return { ...ticket, status: 'Resolved' };
                }
                return ticket;
            }));
        } catch (error) {
            console.error('Error marking ticket as resolved:', error);
        }
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <div>
            <Typography variant="h2">Welcome to My App</Typography>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer}
                sx={{ mr: 2 }}
            >
                <MenuIcon />
            </IconButton>

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                <List>
                    <ListItem button component={Link} to="/create-ticket" onClick={toggleDrawer}>
                        <ListItemText primary="Create Task" />
                    </ListItem>
                    <ListItem button component={Link} to="/tickets" onClick={toggleDrawer}>
                        <ListItemText primary="Task List" />
                    </ListItem>
                </List>
            </Drawer>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tickets.map(ticket => (
                            <TableRow key={ticket.id}>
                                <TableCell>{ticket.title}</TableCell>
                                <TableCell>{ticket.status}</TableCell>
                                <TableCell>
                                    {ticket.status === 'open' && (
                                        <>
                                            <Button onClick={() => handleMarkAsClosed(ticket.id)}>Mark as Closed</Button>
                                            <Button onClick={() => handleMarkAsResolved(ticket.id)}>Mark as Resolved</Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Home;
