import React from 'react';
import { Typography, Button, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export const AccessDenialComponent: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ textCenter: 'center', mt: 10, textAlign: 'center' }}>
        <Typography variant="h1" color="warning.main" fontWeight="bold">
          403
        </Typography>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Access Denied
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          You do not have permission to access this page or resource.
        </Typography>
        <Button variant="contained" color="primary" component={Link} to="/home">
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};
