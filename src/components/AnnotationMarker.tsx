import React from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import { Comment } from '@mui/icons-material';
import { Annotation } from '../types/metrics';

interface AnnotationMarkerProps {
  annotation: Annotation;
  position: { x: number; y: number };
}

export const AnnotationMarker: React.FC<AnnotationMarkerProps> = ({ annotation, position }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        zIndex: 1
      }}
    >
      <Tooltip
        title={`${annotation.message} (${new Date(annotation.timestamp).toLocaleString()})`}
        arrow
      >
        <IconButton size="small" sx={{ color: 'primary.main' }}>
          <Comment fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};