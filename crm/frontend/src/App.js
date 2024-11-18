import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AuthSuccess from './pages/AuthSuccess';
import PrivateRoute from './components/PrivateRoute';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

function App() {
    return (
        <ThemeProvider theme={theme}>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/success" element={<AuthSuccess />} />
                <Route
                    path="/dashboard/*"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
        </ThemeProvider>
    );
}

export default App;
