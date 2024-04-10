import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';

const AdminDashboard = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/tickets');
            setTickets(response.data); 
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    const handleMarkAsResolved = async (ticketId) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/tickets/${ticketId}/mark-resolved`);
            
            fetchTickets();
        } catch (error) {
            console.error('Error marking ticket as resolved:', error);
        }
    };

    const handleMarkAsClosed = async (ticketId) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/tickets/${ticketId}/mark-closed`);
            
            fetchTickets();
        } catch (error) {
            console.error('Error marking ticket as closed:', error);
        }
    };

    return (
        <div>
            <Typography variant="h2" gutterBottom>Admin Dashboard</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ticket ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>User ID</TableCell>
                            <TableCell>Support ID</TableCell>
                            <TableCell>Actions</TableCell> 
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tickets.map(ticket => (
                            <TableRow key={ticket.id}>
                                <TableCell>{ticket.id}</TableCell>
                                <TableCell>{ticket.title}</TableCell>
                                <TableCell>{ticket.description}</TableCell>
                                <TableCell>{ticket.status}</TableCell>
                                <TableCell>{ticket.user_id}</TableCell>
                                <TableCell>{ticket.support_id}</TableCell>
                                <TableCell>
                                    {ticket.status === 'open' && (
                                        <>
                                            <Button onClick={() => handleMarkAsResolved(ticket.id)}>Mark as Resolved</Button>
                                            <Button onClick={() => handleMarkAsClosed(ticket.id)}>Mark as Closed</Button>
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

export default AdminDashboard;
