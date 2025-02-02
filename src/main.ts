import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MetricsService } from './app/services/metrics.service';
import { MetricsChartComponent } from './app/components/metrics-chart/metrics-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MetricsChartComponent],
  template: `
    <div class="dashboard-container">
      <h1>ML Model Performance Dashboard</h1>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div class="metric-card">
          <h3>Accuracy</h3>
          <h2>{{ currentMetrics.accuracy | number:'1.2-2' }}</h2>
        </div>
        <div class="metric-card">
          <h3>Precision</h3>
          <h2>{{ currentMetrics.precision | number:'1.2-2' }}</h2>
        </div>
        <div class="metric-card">
          <h3>Recall</h3>
          <h2>{{ currentMetrics.recall | number:'1.2-2' }}</h2>
        </div>
        <div class="metric-card">
          <h3>F1 Score</h3>
          <h2>{{ currentMetrics.f1Score | number:'1.2-2' }}</h2>
        </div>
      </div>

      <app-metrics-chart></app-metrics-chart>
    </div>
  `,
})
export class App implements OnInit {
  currentMetrics = {
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0
  };

  constructor(private metricsService: MetricsService) {}

  ngOnInit() {
    this.metricsService.getRealtimeMetrics().subscribe(metrics => {
      this.currentMetrics = metrics;
    });
  }
}

bootstrapApplication(App, {
  providers: [MetricsService]
});