
import React from 'react';
import { Typography, List, ListItem, ListItemText, Button } from '@mui/material';

const TicketList = ({ tickets, onResolve }) => {
  return (
    <div>
      <Typography variant="h4">Tickets</Typography>
      <List>
        {tickets.map((ticket, index) => (
          <ListItem key={index}>
            <ListItemText primary={ticket.title} secondary={ticket.description} />
            <Button variant="contained" color="secondary" onClick={() => onResolve(index)}>Resolve</Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TicketList;
