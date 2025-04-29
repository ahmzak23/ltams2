import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SurveyService, Survey, Question, SurveySettings } from '../../services/survey.service';

@Component({
  selector: 'app-survey-create',
  templateUrl: './survey-create.component.html',
  styleUrls: ['./survey-create.component.css']
})
export class SurveyCreateComponent implements OnInit {
  surveyForm: FormGroup;
  questionTypes = [
    { value: 'text', label: 'Text Answer' },
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'rating', label: 'Rating' },
    { value: 'date', label: 'Date' }
  ];

  constructor(
    private fb: FormBuilder,
    private surveyService: SurveyService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.surveyForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      questions: this.fb.array([]),
      settings: this.fb.group({
        allowAnonymous: [false],
        requireAuthentication: [true],
        showProgressBar: [true],
        allowMultipleResponses: [false],
        expirationDate: [null]
      })
    });
  }

  ngOnInit(): void {}

  get questions() {
    return this.surveyForm.get('questions') as FormArray;
  }

  addQuestion() {
    const questionForm = this.fb.group({
      type: ['text', Validators.required],
      text: ['', Validators.required],
      required: [false],
      options: this.fb.array([]),
      minRating: [1],
      maxRating: [5]
    });

    this.questions.push(questionForm);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  getOptions(questionIndex: number) {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  addOption(questionIndex: number) {
    const options = this.getOptions(questionIndex);
    options.push(this.fb.control('', Validators.required));
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const options = this.getOptions(questionIndex);
    options.removeAt(optionIndex);
  }

  onSubmit() {
    if (this.surveyForm.valid) {
      const surveyData: Survey = {
        ...this.surveyForm.value,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.surveyService.createSurvey(surveyData).subscribe({
        next: (response) => {
          this.snackBar.open('Survey created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/surveys']);
        },
        error: (error) => {
          this.snackBar.open('Failed to create survey', 'Close', { duration: 5000 });
        }
      });
    } else {
      this.snackBar.open('Please fill in all required fields correctly', 'Close', { duration: 5000 });
    }
  }

  cancel() {
    this.router.navigate(['/surveys']);
  }
} 