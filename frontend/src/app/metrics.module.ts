import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MetricsService } from './services/metrics.service';
import { MetricsDashboardComponent } from './components/metrics-dashboard/metrics-dashboard.component';

// Material imports
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule
  ],
  exports: [],
  providers: [MetricsService]
})
export class MetricsModule { } 