import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import wrappedLogger from '../../logger';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private metrics: { [key: string]: number } = {};
  private prometheusEndpoint = '/metrics';

  constructor(private http: HttpClient) {
    this.initializeMetrics();
    this.startCollectingMetrics();
  }

  // Generate test logs and metrics
  public generateTestData(): void {
    // Generate frontend logs
    wrappedLogger.debug('Frontend Debug: User interface loaded successfully');
    wrappedLogger.info('Frontend Info: User navigated to dashboard');
    wrappedLogger.warn('Frontend Warning: Slow network connection detected');
    
    try {
      throw new Error('Simulated frontend error');
    } catch (error) {
      // Type cast the error to Error type
      wrappedLogger.error('Frontend Error: Application error occurred', error instanceof Error ? error : new Error(String(error)));
      this.metrics['frontend_errors_total']++;
    }

    // Simulate user interactions
    this.metrics['frontend_user_interactions_total'] += 5;
    
    // Generate backend logs through API call
    this.http.post(`${environment.apiUrl}/api/metrics/test-logs`, {})
      .subscribe({
        next: () => wrappedLogger.info('Backend test logs generated successfully'),
        error: (error) => wrappedLogger.error('Failed to generate backend test logs', error instanceof Error ? error : new Error(String(error)))
      });
  }

  private initializeMetrics() {
    this.metrics = {
      frontend_page_load_time_seconds: 0,
      frontend_memory_usage_bytes: 0,
      frontend_dom_content_loaded_seconds: 0,
      frontend_page_load_complete_seconds: 0,
      frontend_errors_total: 0,
      frontend_user_interactions_total: 0,
      frontend_session_duration_seconds: 0
    };
  }

  private startCollectingMetrics() {
    if (window.performance) {
      const perf = window.performance;
      const timing = perf.timing;

      // Convert milliseconds to seconds for Prometheus
      this.metrics['frontend_page_load_time_seconds'] = 
        (timing.loadEventEnd - timing.navigationStart) / 1000;

      this.metrics['frontend_dom_content_loaded_seconds'] = 
        (timing.domContentLoadedEventEnd - timing.navigationStart) / 1000;

      this.metrics['frontend_page_load_complete_seconds'] = 
        (timing.loadEventEnd - timing.navigationStart) / 1000;
    }

    // Memory usage in bytes
    if ((performance as any).memory) {
      this.metrics['frontend_memory_usage_bytes'] = 
        (performance as any).memory.usedJSHeapSize;
    }

    // Track session duration
    const sessionStart = Date.now();
    setInterval(() => {
      this.metrics['frontend_session_duration_seconds'] = 
        (Date.now() - sessionStart) / 1000;
    }, 1000);

    // Track user interactions
    document.addEventListener('click', () => {
      this.metrics['frontend_user_interactions_total']++;
    });

    // Track errors
    window.addEventListener('error', () => {
      this.metrics['frontend_errors_total']++;
    });

    // Expose metrics endpoint
    this.exposeMetricsEndpoint();
  }

  private exposeMetricsEndpoint() {
    // Create a route handler for /metrics
    const metricsHandler = () => {
      return this.getPrometheusMetrics();
    };

    // Register the route
    const router = (window as any).__router;
    if (router) {
      router.get(this.prometheusEndpoint, metricsHandler);
    }
  }

  public getMetricsObject(): { [key: string]: number } {
    return { ...this.metrics };
  }

  public getPrometheusMetrics(): string {
    let output = '';
    for (const [key, value] of Object.entries(this.metrics)) {
      // Add metric type as a HELP comment
      output += `# HELP ${key} Frontend metric for ${key.replace(/_/g, ' ')}\n`;
      // Add metric type (all are gauges except for totals which are counters)
      const type = key.endsWith('_total') ? 'counter' : 'gauge';
      output += `# TYPE ${key} ${type}\n`;
      // Add the metric value
      output += `${key} ${value}\n`;
    }
    return output;
  }

  public getMetrics(): string {
    let output = '';
    for (const [key, value] of Object.entries(this.metrics)) {
      output += `${key} ${value}\n`;
    }
    return output;
  }
} 