import { Component, OnInit } from '@angular/core';
import { SurveyService, Survey } from '../../services/survey.service';

@Component({
  selector: 'app-survey-list',
  template: `
    <div class="container mt-4">
      <h2>Surveys</h2>
      <div class="mb-3">
        <button class="btn btn-primary" routerLink="/surveys/new">Create New Survey22</button>
      </div>
      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let survey of surveys">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{survey.title}}</h5>
              <p class="card-text">{{survey.description}}</p>
              <div class="d-flex justify-content-between">
                <button class="btn btn-info" [routerLink]="['/surveys', survey.id]">View</button>
                <button class="btn btn-danger" (click)="deleteSurvey(survey.id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class SurveyListComponent implements OnInit {
  surveys: Survey[] = [];

  constructor(private surveyService: SurveyService) { }

  ngOnInit(): void {
    this.loadSurveys();
  }

  loadSurveys(): void {
    this.surveyService.getSurveys().subscribe({
      next: (data) => {
        this.surveys = data;
      },
      error: (error) => {
        console.error('Error loading surveys:', error);
      }
    });
  }

  deleteSurvey(id: number | undefined): void {
    if (id === undefined) {
      console.error('Survey ID is undefined');
      return;
    }
    if (confirm('Are you sure you want to delete this survey?')) {
      this.surveyService.deleteSurvey(id).subscribe(() => {
        this.surveys = this.surveys.filter(survey => survey.id !== id);
      });
    }
  }
} 