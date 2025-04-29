import { Component, OnInit } from '@angular/core';
import { MetricsService } from '../../services/metrics.service';

interface MetricPanel {
  title: string;
  value: number;
  unit: string;
  icon: string;
  category: 'Frontend' | 'API' | 'Survey' | 'User' | 'Error';
}

@Component({
  selector: 'app-metrics-dashboard',
  templateUrl: './metrics-dashboard.component.html',
  styleUrls: ['./metrics-dashboard.component.scss']
})
export class MetricsDashboardComponent implements OnInit {
  metricPanels: MetricPanel[] = [];
  
  constructor(private metricsService: MetricsService) {}

  ngOnInit() {
    this.updateMetrics();
    // Update metrics every 5 seconds
    setInterval(() => this.updateMetrics(), 5000);
  }

  // Generate test data
  generateTestData() {
    this.metricsService.generateTestData();
  }

  private updateMetrics() {
    const metrics = this.metricsService.getMetricsObject();
    
    this.metricPanels = [
      {
        title: 'Page Load Time',
        value: metrics['frontend_page_load_time'],
        unit: 'ms',
        icon: 'timer',
        category: 'Frontend'
      },
      {
        title: 'Memory Usage',
        value: metrics['frontend_memory_usage'],
        unit: 'MB',
        icon: 'memory',
        category: 'Frontend'
      },
      {
        title: 'DOM Content Loaded',
        value: metrics['frontend_dom_content_loaded'],
        unit: 'ms',
        icon: 'code',
        category: 'Frontend'
      },
      {
        title: 'Session Duration',
        value: metrics['frontend_session_duration'],
        unit: 's',
        icon: 'schedule',
        category: 'User'
      },
      {
        title: 'User Interactions',
        value: metrics['frontend_user_interactions'],
        unit: 'clicks',
        icon: 'touch_app',
        category: 'User'
      },
      {
        title: 'Total Errors',
        value: metrics['frontend_errors_total'],
        unit: 'errors',
        icon: 'error',
        category: 'Error'
      }
    ];
  }

  getMetricsByCategory(category: string): MetricPanel[] {
    return this.metricPanels.filter(panel => panel.category === category);
  }
} 