import { useEffect, useState, Suspense } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  IconButton,
  Select,
  MenuItem,
  Button,
  Tab,
  Tabs,
  useTheme as useMuiTheme,
  useMediaQuery
} from '@mui/material';
import { Brightness4, Brightness7, FileDownload } from '@mui/icons-material';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { useTheme } from './theme/ThemeContext';
import { MetricsChart } from './components/MetricsChart';
import { AlertSystem } from './components/AlertSystem';
import { Preloader } from './components/Preloader';
import { ModelComparison } from './components/ModelComparison';
import { Footer } from './components/Footer';
import { Metrics, Alert, MetricsThreshold, ModelConfig, Annotation } from './types/metrics';
import { calculateCustomMetric, predefinedMetrics } from './utils/metricCalculator';

// Initial model configurations remain the same...
const initialModels: ModelConfig[] = [
  {
    id: 'model-1',
    name: 'Production Model',
    description: 'Current production model',
    customMetrics: [
      {
        name: 'F2 Score',
        formula: predefinedMetrics.f2Score.formula,
        description: predefinedMetrics.f2Score.description
      }
    ]
  },
  {
    id: 'model-2',
    name: 'Candidate Model',
    description: 'New model under evaluation',
    customMetrics: [
      {
        name: 'MCC',
        formula: predefinedMetrics.mcc.formula,
        description: predefinedMetrics.mcc.description
      }
    ]
  }
];

function App() {
  const { mode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Record<string, Metrics[]>>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [timeRange, setTimeRange] = useState<number>(20);
  const [selectedModel, setSelectedModel] = useState<string>(initialModels[0].id);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Rest of the state and thresholds remain the same...
  const thresholds: MetricsThreshold[] = [
    { metric: 'accuracy', min: 0.8, max: 1 },
    { metric: 'precision', min: 0.75, max: 1 },
    { metric: 'recall', min: 0.8, max: 1 },
    { metric: 'f1Score', min: 0.75, max: 1 }
  ];

  useEffect(() => {
    let mounted = true;

    const simulateMetrics = () => {
      if (!mounted) return;

      initialModels.forEach(model => {
        const newMetrics: Metrics = {
          accuracy: 0.85 + Math.random() * 0.1,
          precision: 0.82 + Math.random() * 0.1,
          recall: 0.88 + Math.random() * 0.1,
          f1Score: 0.84 + Math.random() * 0.1,
          timestamp: new Date(),
          modelId: model.id,
          customMetrics: {}
        };

        // Calculate custom metrics
        model.customMetrics?.forEach(customMetric => {
          if (newMetrics.customMetrics) {
            newMetrics.customMetrics[customMetric.name] = calculateCustomMetric(
              customMetric.formula,
              {
                accuracy: newMetrics.accuracy,
                precision: newMetrics.precision,
                recall: newMetrics.recall,
                f1Score: newMetrics.f1Score
              }
            );
          }
        });

        setMetrics(prev => ({
          ...prev,
          [model.id]: [...(prev[model.id] || []).slice(-49), newMetrics]
        }));

        // Check thresholds
        thresholds.forEach(threshold => {
          const value = newMetrics[threshold.metric];
          if (value < threshold.min) {
            const alert: Alert = {
              id: `${threshold.metric}-${Date.now()}`,
              message: `${model.name}: ${threshold.metric} is below minimum threshold: ${value.toFixed(3)}`,
              severity: 'warning',
              timestamp: new Date(),
              modelId: model.id
            };
            setAlerts(prev => [...prev.slice(-4), alert]); // Keep last 5 alerts
          }
        });
      });
    };

    // Initial metrics
    simulateMetrics();
    // Simulate initial load delay
    setTimeout(() => mounted && setLoading(false), 1000);

    // Start real-time updates
    const interval = setInterval(simulateMetrics, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleExportData = () => {
    const csvContent = [
      ['Model', 'Timestamp', 'Accuracy', 'Precision', 'Recall', 'F1 Score', 'Custom Metrics'],
      ...Object.entries(metrics).flatMap(([modelId, modelMetrics]) =>
        modelMetrics.map(m => [
          initialModels.find(model => model.id === modelId)?.name || modelId,
          format(m.timestamp, 'yyyy-MM-dd HH:mm:ss'),
          m.accuracy.toFixed(3),
          m.precision.toFixed(3),
          m.recall.toFixed(3),
          m.f1Score.toFixed(3),
          JSON.stringify(m.customMetrics || {})
        ])
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `ml-metrics-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.csv`);
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleAddAnnotation = (newAnnotation: Annotation) => {
    setAnnotations(prev => [...prev, newAnnotation]);
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default',
      color: 'text.primary',
      transition: 'background-color 0.3s, color 0.3s'
    }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src="/logo.svg" alt="ML Metrics Logo" style={{ height: 40 }} />
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                display: { xs: 'none', sm: 'block' }
              }}
            >
              ML Metrics Dashboard
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton onClick={toggleTheme} color="inherit">
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <Button
              variant="outlined"
              startIcon={<FileDownload />}
              onClick={handleExportData}
              size={isMobile ? "small" : "medium"}
            >
              Export Data
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Tabs
            value={selectedModel}
            onChange={(_, value) => setSelectedModel(value)}
            sx={{ mb: 2 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {initialModels.map(model => (
              <Tab key={model.id} value={model.id} label={model.name} />
            ))}
          </Tabs>
        </Box>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Object.entries(metrics[selectedModel]?.[metrics[selectedModel]?.length - 1] || {})
            .filter(([key]) => !['timestamp', 'modelId', 'customMetrics'].includes(key))
            .map(([key, value]) => (
              <Grid item xs={12} sm={6} md={3} key={key}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Typography>
                  <Typography variant="h4">
                    {typeof value === 'number' ? value.toFixed(3) : value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
        </Grid>

        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as typeof chartType)}
            size="small"
          >
            <MenuItem value="line">Line Chart</MenuItem>
            <MenuItem value="bar">Bar Chart</MenuItem>
            <MenuItem value="pie">Pie Chart</MenuItem>
          </Select>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            size="small"
          >
            <MenuItem value={10}>Last 10 points</MenuItem>
            <MenuItem value={20}>Last 20 points</MenuItem>
            <MenuItem value={50}>Last 50 points</MenuItem>
          </Select>
        </Box>

        <Suspense fallback={<Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Preloader /></Box>}>
          <MetricsChart
            metrics={metrics[selectedModel] || []}
            chartType={chartType}
            timeRange={timeRange}
            annotations={annotations.filter(a => a.modelId === selectedModel)}
            onAddAnnotation={handleAddAnnotation}
          />
        </Suspense>

        <ModelComparison metrics={metrics} models={initialModels} />
        
        <AlertSystem
          alerts={alerts.filter(alert => !alert.modelId || alert.modelId === selectedModel)}
          onDismiss={dismissAlert}
        />
      </Container>
      <Footer />
    </Box>
  );
}

export default App;