import { Component } from '@angular/core';
import { BusinessEventsService } from '../../services/business-events.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <img src="assets/logo.png" alt="Logo" style="height:40px; margin-bottom:8px;" />
            <div>Sign in to Admin</div>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput type="text" [(ngModel)]="username" name="username" required autocomplete="username">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="showPassword ? 'text' : 'password'" [(ngModel)]="password" name="password" required autocomplete="current-password">
              <button mat-icon-button matSuffix type="button" (click)="showPassword = !showPassword">
                <mat-icon>{{showPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
            </mat-form-field>
            <div class="actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="loading">Login</button>
              <mat-spinner *ngIf="loading" diameter="24"></mat-spinner>
            </div>
            <div class="links">
              <a routerLink="/register">Register</a> |
              <a href="#" (click)="forgotPassword()">Forgot Password?</a>
            </div>
            <mat-error *ngIf="errorMessage">{{errorMessage}}</mat-error>
            <mat-hint *ngIf="successMessage">{{successMessage}}</mat-hint>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `.login-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f5f6fa; }`,
    `mat-card { width: 100%; max-width: 400px; padding: 24px; }`,
    `.full-width { width: 100%; }`,
    `.actions { display: flex; align-items: center; gap: 12px; margin-top: 16px; }`,
    `.links { margin-top: 12px; font-size: 0.95em; color: #888; }`,
    `mat-error { color: #e53935; margin-top: 8px; display: block; }`,
    `mat-hint { color: #43a047; margin-top: 8px; display: block; }`
  ]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showPassword = false;
  loading = false;
  errorMessage = '';
  successMessage = '';
  private loginStartTime: number = 0;

  constructor(
    private businessEventsService: BusinessEventsService,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginStartTime = Date.now();
  }

  logButtonClick(buttonId: string) {
    this.businessEventsService.logButtonClick(buttonId, this.username || 'anonymous', 'login-page');
  }

  forgotPassword() {
    this.businessEventsService.info('Forgot password clicked', { additional: { page: 'login' } });
    // TODO: Implement forgot password logic
  }

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.http.post('/api/auth/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        this.businessEventsService.logLogin(
          this.username,
          true,
          {
            login_duration_ms: Date.now() - this.loginStartTime,
            login_method: 'password'
          }
        );
        localStorage.setItem('userId', this.username);
        localStorage.setItem('sessionId', Math.random().toString(36).substring(2));
        this.successMessage = 'Login successful! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/admin']);
          this.businessEventsService.info('Redirected to admin dashboard', { additional: { user: this.username } });
        }, 1000);
      },
      error: (err) => {
        this.businessEventsService.logLogin(
          this.username,
          false,
          {
            login_duration_ms: Date.now() - this.loginStartTime,
            login_method: 'password'
          }
        );
        this.errorMessage = 'Login failed. Please check your credentials.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
} 