import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box
} from '@mui/material';
import { Metrics, ModelConfig } from '../types/metrics';

interface ModelComparisonProps {
  metrics: Record<string, Metrics[]>;
  models: ModelConfig[];
}

export const ModelComparison: React.FC<ModelComparisonProps> = ({ metrics, models }) => {
  const comparisonData = useMemo(() => {
    return models.map(model => {
      const modelMetrics = metrics[model.id];
      const latestMetrics = modelMetrics?.[modelMetrics.length - 1];
      
      return {
        modelId: model.id,
        name: model.name,
        metrics: latestMetrics || null
      };
    });
  }, [metrics, models]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Model Comparison</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Model</TableCell>
              <TableCell align="right">Accuracy</TableCell>
              <TableCell align="right">Precision</TableCell>
              <TableCell align="right">Recall</TableCell>
              <TableCell align="right">F1 Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comparisonData.map(({ modelId, name, metrics }) => (
              <TableRow key={modelId}>
                <TableCell component="th" scope="row">{name}</TableCell>
                <TableCell align="right">{metrics?.accuracy.toFixed(3) || 'N/A'}</TableCell>
                <TableCell align="right">{metrics?.precision.toFixed(3) || 'N/A'}</TableCell>
                <TableCell align="right">{metrics?.recall.toFixed(3) || 'N/A'}</TableCell>
                <TableCell align="right">{metrics?.f1Score.toFixed(3) || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};