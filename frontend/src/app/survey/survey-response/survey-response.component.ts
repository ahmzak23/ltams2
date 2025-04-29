import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-survey-response',
  templateUrl: './survey-response.component.html',
  styleUrls: ['./survey-response.component.scss']
})
export class SurveyResponseComponent implements OnInit {
  surveyForm: FormGroup;
  surveyId: string = '';
  loading = true;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.surveyForm = this.fb.group({
      responses: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.surveyId = this.route.snapshot.paramMap.get('id') || '';
    if (this.surveyId) {
      this.loadSurvey();
    }
  }

  loadSurvey(): void {
    // TODO: Implement survey loading logic
    this.loading = false;
  }

  onSubmit(): void {
    if (this.surveyForm.valid) {
      // TODO: Implement survey submission logic
      console.log('Survey responses:', this.surveyForm.value);
    }
  }
} 