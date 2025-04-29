import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <mat-grid-list cols="2" rowHeight="2:1">
        <mat-grid-tile>
          <mat-card>
            <mat-card-header>
              <mat-card-title>Recent Surveys</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <!-- Recent surveys content -->
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        <mat-grid-tile>
          <mat-card>
            <mat-card-header>
              <mat-card-title>Statistics</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <!-- Statistics content -->
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    mat-card {
      width: 90%;
      height: 90%;
    }
  `]
})
export class DashboardComponent {
  constructor() { }
} 