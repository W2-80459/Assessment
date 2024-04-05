import React, { useState } from 'react';
import { Typography, TextField, Button, Container, Grid } from '@mui/material';
import axios from 'axios';

const TicketForm = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (attachment) {
            formData.append('attachment', attachment);
        }

        try {
            
            const response = await axios.post('http://localhost:5000/api/tickets', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            params: {
                user_id: userId
            }
            });

            
            console.log('Ticket created:', response.data);

           
            setTitle('');
            setDescription('');
            setAttachment(null);
        } catch (error) {
            
            console.error('Error creating ticket:', error);
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h2" gutterBottom>Create New Ticket</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <input
                            type="file"
                            accept=".jpg, .jpeg, .png, .pdf"
                            onChange={(e) => setAttachment(e.target.files[0])}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">Submit</Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default TicketForm;
