import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService, Survey } from '../../services/survey.service';

@Component({
  selector: 'app-survey-form',
  template: `
    <div class="container mt-4">
      <h2>{{isEditMode ? 'Edit' : 'Create'}} Survey</h2>
      <form [formGroup]="surveyForm" (ngSubmit)="onSubmit()" class="mt-4">
        <div class="mb-3">
          <label for="title" class="form-label">Title</label>
          <input type="text" class="form-control" id="title" formControlName="title" required>
        </div>

        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea class="form-control" id="description" formControlName="description" rows="3"></textarea>
        </div>

        <div formArrayName="questions" class="mb-3">
          <h3>Questions</h3>
          <button type="button" class="btn btn-secondary mb-3" (click)="addQuestion()">Add Question</button>
          
          <div *ngFor="let question of questions.controls; let i=index" [formGroupName]="i" class="card mb-3">
            <div class="card-body">
              <div class="mb-3">
                <label [for]="'questionText' + i" class="form-label">Question Text</label>
                <input type="text" class="form-control" [id]="'questionText' + i" formControlName="text" required>
              </div>

              <div class="mb-3">
                <label [for]="'questionType' + i" class="form-label">Question Type</label>
                <select class="form-control" [id]="'questionType' + i" formControlName="type">
                  <option value="text">Text</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="single">Single Choice</option>
                </select>
              </div>

              <div formArrayName="options" *ngIf="question.get('type')?.value !== 'text'">
                <label class="form-label">Options</label>
                <div *ngFor="let option of getOptions(i).controls; let j=index" [formGroupName]="j" class="input-group mb-2">
                  <input type="text" class="form-control" formControlName="text" required>
                  <button type="button" class="btn btn-danger" (click)="removeOption(i, j)">Remove</button>
                </div>
                <button type="button" class="btn btn-secondary" (click)="addOption(i)">Add Option</button>
              </div>

              <button type="button" class="btn btn-danger mt-3" (click)="removeQuestion(i)">Remove Question</button>
            </div>
          </div>
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary" [disabled]="!surveyForm.valid">Save Survey</button>
          <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
        </div>
      </form>
    </div>
  `
})
export class SurveyFormComponent implements OnInit {
  surveyForm: FormGroup;
  isEditMode = false;
  surveyId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private surveyService: SurveyService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.surveyForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.surveyId = this.route.snapshot.params['id'];
    if (this.surveyId) {
      this.isEditMode = true;
      this.loadSurvey(this.surveyId);
    }
  }

  get questions() {
    return this.surveyForm.get('questions') as FormArray;
  }

  getOptions(questionIndex: number) {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  addQuestion() {
    const questionForm = this.fb.group({
      text: ['', Validators.required],
      type: ['text'],
      options: this.fb.array([])
    });
    this.questions.push(questionForm);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  addOption(questionIndex: number) {
    const options = this.getOptions(questionIndex);
    const optionForm = this.fb.group({
      text: ['', Validators.required]
    });
    options.push(optionForm);
  }

  removeOption(questionIndex: number, optionIndex: number) {
    this.getOptions(questionIndex).removeAt(optionIndex);
  }

  loadSurvey(id: number) {
    this.surveyService.getSurvey(id).subscribe({
      next: (survey: Survey) => {
        this.surveyForm.patchValue({
          title: survey.title,
          description: survey.description
        });
        
        const questions = JSON.parse(survey.questions as any);
        questions.forEach((q: any) => {
          const questionForm = this.fb.group({
            text: [q.text, Validators.required],
            type: [q.type],
            options: this.fb.array([])
          });
          
          if (q.options) {
            q.options.forEach((o: any) => {
              (questionForm.get('options') as FormArray).push(
                this.fb.group({ text: [o.text, Validators.required] })
              );
            });
          }
          
          this.questions.push(questionForm);
        });
      },
      error: (error) => {
        console.error('Error loading survey:', error);
        this.goBack();
      }
    });
  }

  onSubmit() {
    if (this.surveyForm.valid) {
      const surveyData = {
        ...this.surveyForm.value,
        questions: this.surveyForm.value.questions
      };

      const request = this.isEditMode
        ? this.surveyService.updateSurvey(this.surveyId!, surveyData)
        : this.surveyService.createSurvey(surveyData);

      request.subscribe({
        next: () => {
          this.router.navigate(['/surveys']);
        },
        error: (error) => {
          console.error('Error saving survey:', error);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/surveys']);
  }
} 