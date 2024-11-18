import React, { useState, useEffect, useContext } from 'react';
import {
    Container,
    Typography,
    Paper,
    Grid,
    CircularProgress,
    Box,
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#FF8042', '#00C49F'];

const CampaignDetail = () => {
    const { id } = useParams();
    const { authToken } = useContext(AuthContext);
    const [campaign, setCampaign] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaignDetails = async () => {
            try {
                const [campaignRes, statsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/campaigns/${id}`, {
                        headers: { Authorization: `Bearer ${authToken}` },
                    }),
                    axios.get(`http://localhost:5000/api/campaigns/${id}/stats`, {
                        headers: { Authorization: `Bearer ${authToken}` },
                    }),
                ]);

                setCampaign(campaignRes.data);
                setStats(statsRes.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchCampaignDetails();
    }, [id, authToken]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!campaign) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h6">Campaign not found.</Typography>
            </Container>
        );
    }

    const data = [
        { name: 'Sent', value: stats.sent },
        { name: 'Failed', value: stats.failed },
        { name: 'Pending', value: stats.total - stats.sent - stats.failed },
    ];

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Campaign Details
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Campaign Name:</Typography>
                        <Typography>{campaign.name}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Created At:</Typography>
                        <Typography>{new Date(campaign.createdAt).toLocaleDateString()}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Audience Size:</Typography>
                        <Typography>{stats.total}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Delivery Status:</Typography>
                        <PieChart width={400} height={300}>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default CampaignDetail;
