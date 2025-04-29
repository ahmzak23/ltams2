import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SurveyService, Survey, Question, SurveySettings } from '../../services/survey.service';

@Component({
  selector: 'app-survey-edit',
  templateUrl: './survey-edit.component.html',
  styleUrls: ['./survey-edit.component.scss']
})
export class SurveyEditComponent implements OnInit {
  surveyForm: FormGroup;
  surveyId: string = '';
  loading = true;
  error = '';
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
    private route: ActivatedRoute,
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
      }),
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.surveyId = this.route.snapshot.paramMap.get('id') || '';
    if (this.surveyId) {
      this.loadSurvey();
    } else {
      this.router.navigate(['/surveys']);
    }
  }

  loadSurvey(): void {
    this.loading = true;
    this.surveyService.getSurvey(this.surveyId).subscribe({
      next: (survey) => {
        this.populateForm(survey);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load survey. Please try again later.';
        this.loading = false;
        this.snackBar.open(this.error, 'Close', { duration: 5000 });
      }
    });
  }

  populateForm(survey: Survey): void {
    this.surveyForm.patchValue({
      title: survey.title,
      description: survey.description,
      isActive: survey.isActive,
      settings: survey.settings
    });

    // Clear existing questions
    while (this.questions.length) {
      this.questions.removeAt(0);
    }

    // Ensure questions is always an array
    let questions: any = survey.questions;
    if (typeof questions === 'string') {
      try {
        questions = JSON.parse(questions);
      } catch (e) {
        questions = [];
      }
    }
    questions = Array.isArray(questions) ? questions : [];

    // Add questions from the survey
    questions.forEach((question: any) => {
      this.addQuestion(question);
    });
  }

  get questions() {
    return this.surveyForm.get('questions') as FormArray;
  }

  addQuestion(question?: Question) {
    const questionForm = this.fb.group({
      id: [question?.id || ''],
      type: [question?.type || 'text', Validators.required],
      text: [question?.text || '', Validators.required],
      required: [question?.required || false],
      options: this.fb.array([]),
      minRating: [question?.minRating || 1],
      maxRating: [question?.maxRating || 5]
    });

    this.questions.push(questionForm);

    // If this is an existing question with options, add them
    if (question?.options && question.options.length > 0) {
      const questionIndex = this.questions.length - 1;
      question.options.forEach(option => {
        this.addOption(questionIndex, option);
      });
    }
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  getOptions(questionIndex: number) {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  addOption(questionIndex: number, optionText?: string) {
    const options = this.getOptions(questionIndex);
    options.push(this.fb.control(optionText || '', Validators.required));
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const options = this.getOptions(questionIndex);
    options.removeAt(optionIndex);
  }

  onSubmit() {
    if (this.surveyForm.valid) {
      const surveyData: Survey = {
        ...this.surveyForm.value,
        id: this.surveyId,
        updatedAt: new Date()
      };

      this.surveyService.updateSurvey(this.surveyId, surveyData).subscribe({
        next: (response) => {
          this.snackBar.open('Survey updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/surveys']);
        },
        error: (error) => {
          this.snackBar.open('Failed to update survey', 'Close', { duration: 5000 });
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