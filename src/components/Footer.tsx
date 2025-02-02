import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { format } from 'date-fns';

interface ModelInfo {
  name: string;
  purpose: string;
}

const modelInfo: ModelInfo[] = [
  { name: 'ResNet-50', purpose: 'Image Classification' },
  { name: 'BERT-Base', purpose: 'Natural Language Processing' },
  { name: 'YOLOv5', purpose: 'Object Detection' },
  { name: 'GPT-3', purpose: 'Text Generation' },
  { name: 'U-Net', purpose: 'Image Segmentation' }
];

export const Footer: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Update ticker every 5 seconds
    const tickerInterval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % modelInfo.length);
    }, 5000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(tickerInterval);
    };
  }, []);

  return (
    <Paper
      component="footer"
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        py: 1,
        px: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        zIndex: 1000
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          variant="body2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            transition: 'opacity 0.3s',
            opacity: 0.9,
            '&:hover': { opacity: 1 }
          }}
        >
          <strong>{modelInfo[tickerIndex].name}</strong>
          &nbsp;|&nbsp;
          {modelInfo[tickerIndex].purpose}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
        {format(currentTime, 'PPpp')}
      </Typography>
    </Paper>
  );
};