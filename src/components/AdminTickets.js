import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AssignSupport from './AssignSupport';
import axios from 'axios';

const AdminTickets = () => {
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

  const handleUpdateTicket = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/tickets');
      setTickets(response.data);
      console.log('Ticket data updated successfully');
    } catch (error) {
      console.error('Error updating ticket data:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4">All Tickets</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Attachment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Support ID</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map(ticket => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>{ticket.attachment}</TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>{ticket.support_id}</TableCell>
                <TableCell>
                  <AssignSupport ticketId={ticket.id} onUpdate={handleUpdateTicket} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminTickets;
