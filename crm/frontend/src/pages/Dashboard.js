import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Audience from './Audience';
import Campaigns from './Campaigns';
import CampaignDetail from './CampaignDetail';
import {
    AppBar,
    Toolbar,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CssBaseline,
    Typography,
    Box,
    Divider,
    IconButton,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CampaignIcon from '@mui/icons-material/Campaign';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';


const drawerWidth = 240;

const Dashboard = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                }}
            >
                <Toolbar>
                    <img src="data:image/png;base64,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" alt="Company Logo" style={{ height: '40px', marginRight: '16px' }} />
                    <Typography variant="h6" noWrap component="div">
                        CRM Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem button component={Link} to="/dashboard/audience">
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Audience" />
                        </ListItem>
                        <ListItem button component={Link} to="/dashboard/campaigns">
                            <ListItemIcon>
                                <CampaignIcon />
                            </ListItemIcon>
                            <ListItemText primary="Campaigns" />
                        </ListItem>
                        <ListItem button component={Link} to="/">
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                    </List>
                    <Divider />
                </Box>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                <Routes>
                    <Route path="audience" element={<Audience />} />
                    <Route path="campaigns" element={<Campaigns />} />
                    <Route path="campaigns/:id" element={<CampaignDetail />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default Dashboard;
