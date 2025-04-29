// Custom metrics class for browser environment
class BrowserMetrics {
  private metrics: { [key: string]: number } = {};
  private labels: { [key: string]: string[] } = {};

  // Record a metric value
  record(name: string, value: number, labelValues: string[] = []) {
    const key = this.getMetricKey(name, labelValues);
    this.metrics[key] = value;
    this.labels[key] = labelValues;
  }

  // Get all metrics in Prometheus format
  getMetrics(): string {
    let output = '';
    
    for (const [key, value] of Object.entries(this.metrics)) {
      const name = key.split('{')[0];
      const labels = this.labels[key];
      const labelString = labels.length > 0 
        ? `{${labels.map((l, i) => `label${i}="${l}"`).join(',')}}`
        : '';
      
      output += `${name}${labelString} ${value}\n`;
    }
    
    return output;
  }

  private getMetricKey(name: string, labelValues: string[]): string {
    return labelValues.length > 0 
      ? `${name}{${labelValues.join(',')}}`
      : name;
  }
}

// Create a global metrics instance
const metrics = new BrowserMetrics();

// Page Load Time
export function measurePageLoadTime(pageName: string) {
  const startTime = performance.now();
  window.addEventListener('load', () => {
    const loadTime = (performance.now() - startTime) / 1000;
    metrics.record('page_load_time_seconds', loadTime, [pageName]);
  });
}

// Browser Memory Usage
export function updateBrowserMetrics() {
  // Use performance.memory if available (Chrome only)
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    metrics.record('browser_memory_usage_bytes', memory.usedJSHeapSize);
  }
  
  // Record navigation timing metrics
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    metrics.record('dom_content_loaded_seconds', navigation.domContentLoadedEventEnd / 1000);
    metrics.record('page_load_seconds', navigation.loadEventEnd / 1000);
  }
}

// Client-side Error Tracking
export function trackClientError(error: Error, location: string) {
  metrics.record('client_errors_total', 1, [error.name, location]);
}

// User Interaction Tracking
export function trackUserInteraction(interactionType: string) {
  metrics.record('user_interaction_total', 1, [interactionType]);
}

// User Session Duration
export function trackUserSession() {
  const startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const duration = (Date.now() - startTime) / 1000;
    metrics.record('user_session_duration_seconds', duration);
  });
}

// Initialize metrics
export function initializeMetrics() {
  measurePageLoadTime('main');
  setInterval(updateBrowserMetrics, 5000);
  trackUserSession();
  
  // Track unhandled errors
  window.addEventListener('error', (event) => {
    trackClientError(event.error || new Error(event.message), 'unhandled');
  });
  
  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    trackClientError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      'unhandled_promise'
    );
  });
}

// Export metrics endpoint
export function getMetrics(): string {
  return metrics.getMetrics();
} 