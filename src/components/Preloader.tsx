import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export const Preloader: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: (theme) => theme.palette.background.default,
        zIndex: 9999,
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Loading ML Metrics...
      </Typography>
    </Box>
  );
};