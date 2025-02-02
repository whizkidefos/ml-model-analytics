import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  // Simulate real-time data updates
  getRealtimeMetrics(): Observable<ModelMetrics> {
    return interval(5000).pipe(
      map(() => ({
        accuracy: 0.85 + Math.random() * 0.1,
        precision: 0.82 + Math.random() * 0.1,
        recall: 0.88 + Math.random() * 0.1,
        f1Score: 0.84 + Math.random() * 0.1,
        timestamp: new Date()
      }))
    );
  }
}