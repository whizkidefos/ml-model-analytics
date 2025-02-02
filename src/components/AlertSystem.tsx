import React from 'react';
import { Alert as MuiAlert, Snackbar, Stack } from '@mui/material';
import { Alert } from '../types/metrics';

interface AlertSystemProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

export const AlertSystem: React.FC<AlertSystemProps> = ({ alerts, onDismiss }) => {
  return (
    <Stack spacing={2} sx={{ position: 'fixed', bottom: 24, right: 24, maxWidth: 400 }}>
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={true}
          autoHideDuration={6000}
          onClose={() => onDismiss(alert.id)}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity={alert.severity}
            onClose={() => onDismiss(alert.id)}
          >
            {alert.message}
          </MuiAlert>
        </Snackbar>
      ))}
    </Stack>
  );
};