import React, { useState, useContext } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    FormControlLabel,
    Checkbox,
    Paper,
    Box,
    Alert,
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Audience = () => {
    const { authToken } = useContext(AuthContext);

    const [criteria, setCriteria] = useState({
        totalSpending: { gt: '', lt: '' },
        visits: { gte: '', lte: '' },
        lastVisitDate: { after: '', before: '' },
        logic: 'AND',
    });

    const [audienceSize, setAudienceSize] = useState(null);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e, category, field) => {
        setCriteria({
            ...criteria,
            [category]: {
                ...criteria[category],
                [field]: e.target.value,
            },
        });
    };

    const handleLogicChange = (e) => {
        setCriteria({
            ...criteria,
            logic: e.target.checked ? 'OR' : 'AND',
        });
    };

    const validate = () => {
        let temp = {};
        temp.totalSpending = criteria.totalSpending.gt || criteria.totalSpending.lt ? "" : "At least one spending criteria is required.";
        temp.visits = criteria.visits.gte || criteria.visits.lte ? "" : "At least one visits criteria is required.";
        temp.lastVisitDate = criteria.lastVisitDate.after || criteria.lastVisitDate.before ? "" : "At least one visit date criteria is required.";

        setErrors({ ...temp });

        return Object.values(temp).every(x => x === "");
    };

    const calculateAudience = async () => {
        if (!validate()) {
            setErrorMsg('Please fill at least one criteria for each category.');
            return;
        }
        setErrorMsg('');
        try {
            const response = await axios.post(
                'http://localhost:5000/api/campaigns/calculate-audience',
                { audienceCriteria: criteria },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            setAudienceSize(response.data.size);
        } catch (error) {
            console.error(error);
            setErrorMsg('Error calculating audience size.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            setErrorMsg('Please fill at least one criteria for each category.');
            return;
        }

        try {
            const campaignName = prompt('Enter Campaign Name:');
            if (!campaignName) {
                alert('Campaign name is required');
                return;
            }

            const response = await axios.post(
                'http://localhost:5000/api/campaigns',
                { name: campaignName, audienceCriteria: criteria },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            setSuccess('Campaign Created Successfully!');
            setErrorMsg('');
            setCriteria({
                totalSpending: { gt: '', lt: '' },
                visits: { gte: '', lte: '' },
                lastVisitDate: { after: '', before: '' },
                logic: 'AND',
            });
            setAudienceSize(null);
        } catch (error) {
            console.error(error);
            setErrorMsg('Error creating campaign.');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Create Audience Segment
                </Typography>
                {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Total Spending */}
                        <Grid item xs={12}>
                            <Typography variant="h6">Total Spending</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Greater than (INR)"
                                type="number"
                                fullWidth
                                value={criteria.totalSpending.gt}
                                onChange={(e) => handleChange(e, 'totalSpending', 'gt')}
                                error={!!errors.totalSpending}
                                helperText={errors.totalSpending}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Less than (INR)"
                                type="number"
                                fullWidth
                                value={criteria.totalSpending.lt}
                                onChange={(e) => handleChange(e, 'totalSpending', 'lt')}
                                error={!!errors.totalSpending}
                                helperText={errors.totalSpending}
                            />
                        </Grid>

                        {/* Visits */}
                        <Grid item xs={12}>
                            <Typography variant="h6">Visits</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Greater than or equal to"
                                type="number"
                                fullWidth
                                value={criteria.visits.gte}
                                onChange={(e) => handleChange(e, 'visits', 'gte')}
                                error={!!errors.visits}
                                helperText={errors.visits}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Less than or equal to"
                                type="number"
                                fullWidth
                                value={criteria.visits.lte}
                                onChange={(e) => handleChange(e, 'visits', 'lte')}
                                error={!!errors.visits}
                                helperText={errors.visits}
                            />
                        </Grid>

                        {/* Last Visit Date */}
                        <Grid item xs={12}>
                            <Typography variant="h6">Last Visit Date</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="After (mm/dd/yyyy)"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={criteria.lastVisitDate.after}
                                onChange={(e) => handleChange(e, 'lastVisitDate', 'after')}
                                error={!!errors.lastVisitDate}
                                helperText={errors.lastVisitDate}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Before (mm/dd/yyyy)"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={criteria.lastVisitDate.before}
                                onChange={(e) => handleChange(e, 'lastVisitDate', 'before')}
                                error={!!errors.lastVisitDate}
                                helperText={errors.lastVisitDate}
                            />
                        </Grid>

                        {/* Logic Selector */}
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={criteria.logic === 'OR'}
                                        onChange={handleLogicChange}
                                    />
                                }
                                label="Use OR logic instead of AND"
                            />
                        </Grid>

                        {/* Audience Size */}
                        {audienceSize !== null && (
                            <Grid item xs={12}>
                                <Typography variant="h6">
                                    Audience Size: {audienceSize}
                                </Typography>
                            </Grid>
                        )}

                        {/* Buttons */}
                        <Grid item xs={6}>
                            <Button variant="contained" color="primary" fullWidth onClick={calculateAudience}>
                                Calculate Audience Size
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="contained" color="secondary" fullWidth type="submit">
                                Save Campaign
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default Audience;
