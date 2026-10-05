import React from 'react';
import { Typography, Button, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export const NotFoundComponent: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ textCenter: 'center', mt: 10, textAlign: 'center' }}>
        <Typography variant="h1" color="error" fontWeight="bold">
          404
        </Typography>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Button variant="contained" color="primary" component={Link} to="/home">
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};
