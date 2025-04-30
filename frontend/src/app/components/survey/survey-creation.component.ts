import { Component } from '@angular/core';
import { BusinessEventsService } from '../../services/business-events.service';

@Component({
  selector: 'app-survey-creation',
  template: `
    <div class="survey-creation-container">
      <h2>Create New Survey</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Survey Title</label>
          <input type="text" id="title" [(ngModel)]="survey.title" name="title" required>
        </div>
        
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" [(ngModel)]="survey.description" name="description"></textarea>
        </div>

        <div class="questions-container">
          <h3>Questions</h3>
          <div *ngFor="let question of survey.questions; let i = index" class="question-item">
            <input type="text" [(ngModel)]="question.text" [name]="'question-' + i" placeholder="Question text">
            <button type="button" (click)="removeQuestion(i)" class="remove-btn">Remove</button>
          </div>
          <button type="button" (click)="addQuestion()" class="add-btn">Add Question</button>
        </div>

        <button type="submit" (click)="logButtonClick('create-survey-button')">Create Survey</button>
      </form>
    </div>
  `,
  styles: [`
    .survey-creation-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
    input, textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    textarea {
      min-height: 100px;
    }
    .questions-container {
      margin: 20px 0;
    }
    .question-item {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }
    .remove-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
    }
    .add-btn {
      background-color: #28a745;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
    }
    button[type="submit"] {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
    }
  `]
})
export class SurveyCreationComponent {
  survey = {
    title: '',
    description: '',
    questions: [
      { text: '' }
    ]
  };

  constructor(private businessEventsService: BusinessEventsService) {}

  logButtonClick(buttonId: string) {
    const userId = localStorage.getItem('userId') || 'anonymous';
    this.businessEventsService.logButtonClick(buttonId, userId, 'survey-creation-page');
  }

  addQuestion() {
    this.survey.questions.push({ text: '' });
  }

  removeQuestion(index: number) {
    this.survey.questions.splice(index, 1);
  }

  onSubmit() {
    const userId = localStorage.getItem('userId') || 'anonymous';
    const surveyId = Math.random().toString(36).substring(2);
    
    this.businessEventsService.logSurveyCreated(
      surveyId,
      userId,
      {
        title: this.survey.title,
        question_count: this.survey.questions.length,
        timestamp: new Date().toISOString()
      }
    );

    // Here you would typically save the survey to your backend
    console.log('Survey created:', this.survey);
  }
} 