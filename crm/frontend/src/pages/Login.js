import React from 'react';
import { Button, Typography, Icon,Box, Container } from '@mui/material';

const Login = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in with Google
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleLogin}
          startIcon={<Icon>login</Icon>}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
