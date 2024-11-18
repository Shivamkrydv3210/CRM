import React, { useState, useContext } from 'react';
import { Button, CircularProgress, Typography, Box } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const SendMessages = ({ campaignId }) => {
    const { authToken } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSendMessages = async () => {
        setLoading(true);
        try {
            await axios.post(
                `http://localhost:5000/api/campaigns/${campaignId}/send-messages`,
                { message: `Hi [Name], here’s 10% off on your next order!` },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            alert('Messages are being sent!');
        } catch (error) {
            console.error(error);
            alert('Error sending messages');
        }
        setLoading(false);
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
                Send Personalized Messages to Audience
            </Typography>
            <Button variant="contained" color="primary" onClick={handleSendMessages} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Send Messages'}
            </Button>
        </Box>
    );
};

export default SendMessages;
