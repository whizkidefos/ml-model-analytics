import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Box, Paper } from '@mui/material';
import { Metrics, Annotation } from '../types/metrics';
import { useTheme } from '../theme/ThemeContext';
import { AnnotationMarker } from './AnnotationMarker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface MetricsChartProps {
  metrics: Metrics[];
  chartType: 'line' | 'bar' | 'pie';
  timeRange: number;
  annotations: Annotation[];
}

export const MetricsChart: React.FC<MetricsChartProps> = ({
  metrics,
  chartType,
  timeRange,
  annotations
}) => {
  const { mode } = useTheme();
  const chartRef = React.useRef<any>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const filteredMetrics = metrics.slice(-timeRange);

  const chartData = {
    labels: filteredMetrics.map(m => m.timestamp.toLocaleTimeString()),
    datasets: [
      {
        label: 'Accuracy',
        data: filteredMetrics.map(m => m.accuracy),
        borderColor: mode === 'dark' ? 'rgb(100, 217, 217)' : 'rgb(75, 192, 192)',
        backgroundColor: mode === 'dark' ? 'rgba(100, 217, 217, 0.2)' : 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      },
      {
        label: 'Precision',
        data: filteredMetrics.map(m => m.precision),
        borderColor: mode === 'dark' ? 'rgb(255, 124, 157)' : 'rgb(255, 99, 132)',
        backgroundColor: mode === 'dark' ? 'rgba(255, 124, 157, 0.2)' : 'rgba(255, 99, 132, 0.2)',
        tension: 0.1
      },
      {
        label: 'Recall',
        data: filteredMetrics.map(m => m.recall),
        borderColor: mode === 'dark' ? 'rgb(124, 157, 255)' : 'rgb(99, 132, 255)',
        backgroundColor: mode === 'dark' ? 'rgba(124, 157, 255, 0.2)' : 'rgba(99, 132, 255, 0.2)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: chartType !== 'pie' ? {
      y: {
        beginAtZero: true,
        max: 1,
        grid: {
          color: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          color: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      }
    } : undefined,
    plugins: {
      legend: {
        labels: {
          color: mode === 'dark' ? '#fff' : '#666'
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y || context.parsed || 0;
            return `${label}: ${value.toFixed(3)}`;
          }
        }
      }
    }
  };

  const ChartComponent = {
    line: Line,
    bar: Bar,
    pie: Pie
  }[chartType];

  const getAnnotationPosition = (annotation: Annotation) => {
    if (!chartRef.current || !containerRef.current) {
      return null;
    }

    const chart = chartRef.current;
    const metricName = annotation.metric?.toLowerCase();
    
    if (!metricName) return null;

    const datasetIndex = chartData.datasets.findIndex(
      ds => ds.label.toLowerCase() === metricName
    );
    
    if (datasetIndex === -1) return null;

    const timeIndex = filteredMetrics.findIndex(
      m => m.timestamp.getTime() === annotation.timestamp.getTime()
    );
    
    if (timeIndex === -1) return null;

    const meta = chart.getDatasetMeta(datasetIndex);
    if (!meta || !meta.data[timeIndex]) return null;

    const x = meta.data[timeIndex].x;
    const y = meta.data[timeIndex].y;

    return { x, y };
  };

  return (
    <Box component={Paper} sx={{ p: 2, height: '400px', position: 'relative' }} ref={containerRef}>
      <ChartComponent
        ref={chartRef}
        data={chartData}
        options={chartOptions}
      />
      {chartRef.current && annotations.map(annotation => {
        const position = getAnnotationPosition(annotation);
        if (!position) return null;
        return (
          <AnnotationMarker
            key={annotation.id}
            annotation={annotation}
            position={position}
          />
        );
      })}
    </Box>
  );
};