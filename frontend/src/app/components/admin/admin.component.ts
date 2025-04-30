import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessEventsService } from '../../services/business-events.service';

@Component({
  selector: 'app-admin',
  template: `
    <div class="admin-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Welcome to the Admin Dashboard</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>You are now logged in as <b>{{userId}}</b>.</p>
          <button mat-raised-button color="accent" (click)="signOut()">Sign Out</button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `.admin-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f5f6fa; }`,
    `mat-card { width: 100%; max-width: 400px; padding: 24px; text-align: center; }`
  ]
})
export class AdminComponent implements OnInit {
  userId: string = '';

  constructor(
    private router: Router,
    private businessEventsService: BusinessEventsService
  ) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId') || 'anonymous';
    this.businessEventsService.info('Visited admin dashboard', { additional: { user: this.userId } });
  }

  signOut() {
    const sessionStart = Number(localStorage.getItem('sessionStart')) || Date.now();
    const sessionDuration = Date.now() - sessionStart;
    this.businessEventsService.logLogout(this.userId, sessionDuration);
    localStorage.removeItem('userId');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('sessionStart');
    this.businessEventsService.info('User signed out', { additional: { user: this.userId } });
    this.router.navigate(['/login']);
  }
} 