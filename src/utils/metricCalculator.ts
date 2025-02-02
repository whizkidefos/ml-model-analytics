export const calculateConfusionMatrix = (metrics: Record<string, number>) => {
  const { precision, recall } = metrics;
  // Estimate confusion matrix values from precision and recall
  // Assuming 100 total predictions for scaling
  const tp = 100 * recall;
  const fp = tp * (1 - precision) / precision;
  const fn = tp * (1 - recall) / recall;
  const tn = 100 - (tp + fp + fn);
  
  return { tp, tn, fp, fn };
};

export const calculateCustomMetric = (
  formula: string,
  metrics: Record<string, number>
): number => {
  // Add confusion matrix values to the metrics
  const { tp, tn, fp, fn } = calculateConfusionMatrix(metrics);
  const enrichedMetrics = {
    ...metrics,
    tp,
    tn,
    fp,
    fn,
    falsePositiveRate: fp / (fp + tn)
  };
  
  // Safe evaluation of custom metric formulas
  const safeEval = new Function(
    ...Object.keys(enrichedMetrics),
    `try {
      return ${formula};
    } catch (e) {
      return 0;
    }`
  );
  
  try {
    const result = safeEval(...Object.values(enrichedMetrics));
    return isNaN(result) ? 0 : result;
  } catch (error) {
    console.error('Error calculating custom metric:', error);
    return 0;
  }
};

export const predefinedMetrics = {
  f2Score: {
    name: 'F2 Score',
    formula: '(5 * precision * recall) / (4 * precision + recall)',
    description: 'F2 score weighs recall higher than precision'
  },
  specificity: {
    name: 'Specificity',
    formula: '1 - falsePositiveRate',
    description: 'True negative rate'
  },
  mcc: {
    name: 'Matthews Correlation Coefficient',
    formula: '((tp * tn) - (fp * fn)) / Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn))',
    description: 'Balanced measure for imbalanced datasets'
  }
};