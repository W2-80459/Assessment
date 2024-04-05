import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Button, Modal, TextField } from '@mui/material';
import axios from 'axios';

const TechSupportDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [answerModalOpen, setAnswerModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [answerText, setAnswerText] = useState('');
    const userId = localStorage.getItem('userId');
    const [attachment, setAttachment] = useState(null);

    useEffect(() => {
        
        const fetchAssignedTickets = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/tech-support/assigned-tickets?support_id=${userId}`);
                setTickets(response.data);
            } catch (error) {
                console.error('Error fetching assigned tickets:', error);
            }
        };

        fetchAssignedTickets(); 
    }, [userId]); 

    const handleAnswerTicket = async (ticketId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/tickets/${ticketId}`);
            setSelectedTicket(response.data);
            setAnswerModalOpen(true); 
        } catch (error) {
            console.error('Error fetching ticket details:', error);
        }
    };
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

    const handleModalClose = () => {
        setAnswerModalOpen(false); 
    };

    const handleAnswerSubmit = async (ticketId, answerText, attachment) => {
        const formData = new FormData();
        formData.append('answerText', answerText);
        if (attachment) {
            formData.append('attachment', attachment);
        }
    
        try {
            const response = await axios.post(`http://localhost:5000/api/tech-support/answer-ticket/${ticketId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Answer submitted:', response.data);
           
        } catch (error) {
            console.error('Error submitting answer:', error);
           
        }
    };
    

    return (
        <div>
            <Typography variant="h2" gutterBottom>Assigned Tickets</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ticket ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tickets.map(ticket => (
                            <TableRow key={ticket.id}>
                                <TableCell>{ticket.id}</TableCell>
                                <TableCell>{ticket.title}</TableCell>
                                <TableCell>{ticket.status}</TableCell>
                                <TableCell>
                                    {ticket.status === 'open' && (
                                        <>
                                            <Button onClick={() => handleAnswerTicket(ticket.id)}>Answer</Button>
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
            <Modal open={answerModalOpen} onClose={handleModalClose}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
                    <Typography variant="h4">Answer Ticket</Typography>
                    {selectedTicket && (
                        <>
                            <Typography variant="h6">Ticket ID: {selectedTicket.id}</Typography>
                            <Typography variant="body1">Description: {selectedTicket.description}</Typography>
                            <Typography variant="body1">Attachment: {selectedTicket.attachment}</Typography>
                        </>
                    )}
                    <TextField
                        label="Answer"
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                    />

                    <Grid item xs={12}>
                        <input
                            type="file"
                            accept=".jpg, .jpeg, .png, .pdf"
                            onChange={(e) => setAttachment(e.target.files[0])}
                        />
                    </Grid>

                    <Button onClick={handleAnswerSubmit}>Submit Answer</Button>
                </div>
            </Modal>
        </div>
    );
};

export default TechSupportDashboard;
