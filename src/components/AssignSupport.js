import React, { useState, useEffect } from 'react';
import { Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const AssignSupport = ({ ticketId, onUpdate }) => {
  const [supportId, setSupportId] = useState('');
  const [supportOptions, setSupportOptions] = useState([]);

  useEffect(() => {
    const fetchSupportOptions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/support-options');
        setSupportOptions(response.data);
      } catch (error) {
        console.error('Error fetching support options:', error);
      }
    };

    fetchSupportOptions();
  }, []);

  const handleAssignSupport = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admin/tickets/${ticketId}/assign-support`, {
        supportId: supportId
      });

      console.log('Support assigned successfully');
      
      
      onUpdate();
    } catch (error) {
      console.error('Error assigning support:', error);
    }
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="support-select-label">Select Support</InputLabel>
        <Select
          labelId="support-select-label"
          id="support-select"
          value={supportId}
          onChange={(e) => setSupportId(e.target.value)}
        >
          {supportOptions.map(option => (
            <MenuItem key={option.id} value={option.id}>{option.email}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button onClick={handleAssignSupport} variant="contained" color="primary">Assign Support</Button>
    </div>
  );
};

export default AssignSupport;
