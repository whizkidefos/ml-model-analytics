export interface Metrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  timestamp: Date;
  modelId: string;
  customMetrics?: Record<string, number>;
}

export interface MetricsThreshold {
  metric: keyof Omit<Metrics, 'timestamp' | 'modelId' | 'customMetrics'>;
  min: number;
  max: number;
  modelId?: string;
}

export interface Alert {
  id: string;
  message: string;
  severity: 'warning' | 'error';
  timestamp: Date;
  modelId?: string;
}

export interface Annotation {
  id: string;
  message: string;
  timestamp: Date;
  modelId: string;
  metric?: keyof Metrics;
  value?: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  customMetrics?: {
    name: string;
    formula: string;
    description: string;
  }[];
}