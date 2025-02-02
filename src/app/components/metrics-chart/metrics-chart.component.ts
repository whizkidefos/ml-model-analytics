import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration } from 'chart.js';
import { MetricsService } from '../../services/metrics.service';

@Component({
  selector: 'app-metrics-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div class="chart-container">
      <canvas baseChart
        [data]="chartData"
        [options]="chartOptions"
        [type]="'line'">
      </canvas>
    </div>
  `
})
export class MetricsChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  chartData: ChartConfiguration['data'] = {
    datasets: [
      {
        label: 'Accuracy',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Precision',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ],
    labels: []
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 1
      }
    }
  };

  constructor(private metricsService: MetricsService) {}

  ngOnInit() {
    this.metricsService.getRealtimeMetrics().subscribe(metrics => {
      this.updateChart(metrics);
    });
  }

  private updateChart(metrics: any) {
    if (this.chartData.datasets[0].data.length > 20) {
      this.chartData.datasets[0].data.shift();
      this.chartData.datasets[1].data.shift();
      this.chartData.labels?.shift();
    }

    this.chartData.datasets[0].data.push(metrics.accuracy);
    this.chartData.datasets[1].data.push(metrics.precision);
    this.chartData.labels?.push(metrics.timestamp.toLocaleTimeString());
    
    this.chart?.update();
  }
}