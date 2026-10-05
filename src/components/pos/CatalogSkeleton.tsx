import React from 'react';
import { Grid, Card, CardContent, Skeleton, Box } from '@mui/material';

export const CatalogSkeleton: React.FC = () => {
  const skeletons = Array.from({ length: 8 });

  return (
    <Grid container spacing={2}>
      {skeletons.map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card sx={{ minHeight: 160, padding: 1 }}>
            <CardContent>
              <Skeleton variant="text" width="80%" height={25} />
              <Skeleton variant="text" width="50%" height={20} sx={{ mb: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Skeleton variant="text" width="30%" height={25} />
                <Skeleton variant="text" width="30%" height={25} />
              </Box>
              <Skeleton variant="rectangular" height={36} sx={{ mt: 2, borderRadius: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
