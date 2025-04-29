import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SurveyService, Survey } from '../../services/survey.service';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent implements OnInit {
  surveys: Survey[] = [];
  loading = true;
  error = '';

  constructor(
    private surveyService: SurveyService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSurveys();
  }

  loadSurveys(): void {
    this.loading = true;
    this.surveyService.getSurveys().subscribe({
      next: (surveys) => {
        this.surveys = surveys;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load surveys. Please try again later.';
        this.loading = false;
        this.snackBar.open(this.error, 'Close', { duration: 5000 });
      }
    });
  }

  createSurvey(): void {
    this.router.navigate(['/surveys/create']);
  }

  editSurvey(survey: Survey): void {
    this.router.navigate(['/surveys/edit', survey.id]);
  }

  viewResponses(survey: Survey): void {
    this.router.navigate(['/surveys', survey.id, 'responses']);
  }

  viewAnalytics(survey: Survey): void {
    this.router.navigate(['/surveys', survey.id, 'analytics']);
  }

  deleteSurvey(survey: Survey): void {
    if (confirm('Are you sure you want to delete this survey?')) {
      this.surveyService.deleteSurvey(survey.id!).subscribe({
        next: () => {
          this.surveys = this.surveys.filter(s => s.id !== survey.id);
          this.snackBar.open('Survey deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Failed to delete survey', 'Close', { duration: 5000 });
        }
      });
    }
  }
} 