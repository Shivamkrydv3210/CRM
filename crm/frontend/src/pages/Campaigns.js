import React, { useState, useEffect, useContext } from 'react';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Campaigns = () => {
    const { authToken } = useContext(AuthContext);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/campaigns', {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setCampaigns(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, [authToken]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Campaign History
            </Typography>
            {campaigns.length === 0 ? (
                <Typography>No campaigns found.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Campaign Name</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Audience Size</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {campaigns.map((campaign) => (
                                <TableRow key={campaign._id}>
                                    <TableCell>{campaign.name}</TableCell>
                                    <TableCell>{new Date(campaign.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{/* Optionally, fetch and display audience size */}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            component={Link}
                                            to={`/dashboard/campaigns/${campaign._id}`}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default Campaigns;
