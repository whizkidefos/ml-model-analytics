# ML Metrics Dashboard

A real-time dashboard for monitoring and visualizing machine learning model performance metrics. Built with React, Material-UI, and Chart.js.

![ML Metrics Dashboard](public/logo.svg)

## Features

- 📊 Real-time metrics visualization
- 🌓 Dark/Light mode support
- 📱 Responsive design
- 📈 Multiple chart types (Line, Bar, Pie)
- ⚡ Real-time alerts for metric thresholds
- 📥 Export data to CSV
- 🔄 Model comparison
- ⏰ Live time and model ticker
- 📝 Custom metrics support

## Tech Stack

- React 18
- TypeScript
- Material-UI (MUI)
- Chart.js with react-chartjs-2
- Vite
- date-fns
- file-saver

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ml-metrics-dashboard.git
cd ml-metrics-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
ml-metrics-dashboard/
├── src/
│   ├── components/         # React components
│   ├── theme/             # Theme configuration
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
└── package.json         # Project dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests

## Customization

### Adding Custom Metrics

Custom metrics can be added by modifying the `initialModels` configuration in `App.tsx`:

```typescript
const initialModels: ModelConfig[] = [
  {
    id: 'model-1',
    name: 'Production Model',
    customMetrics: [
      {
        name: 'Custom Metric',
        formula: 'your_formula_here',
        description: 'Description of your metric'
      }
    ]
  }
];
```

### Modifying Alert Thresholds

Adjust metric thresholds by modifying the `thresholds` array in `App.tsx`:

```typescript
const thresholds: MetricsThreshold[] = [
  { metric: 'accuracy', min: 0.8, max: 1 },
  { metric: 'precision', min: 0.75, max: 1 }
];
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the component library
- Chart.js for visualization capabilities
- The React community for inspiration and support