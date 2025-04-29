import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { SurveyListComponent } from './survey-list/survey-list.component';
import { SurveyCreateComponent } from './survey-create/survey-create.component';
import { SurveyEditComponent } from './survey-edit/survey-edit.component';
import { SurveyResponseComponent } from './survey-response/survey-response.component';
import { SurveyAnalyticsComponent } from './survey-analytics/survey-analytics.component';

@NgModule({
  declarations: [
    SurveyListComponent,
    SurveyCreateComponent,
    SurveyEditComponent,
    SurveyResponseComponent,
    SurveyAnalyticsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [
    SurveyListComponent,
    SurveyCreateComponent,
    SurveyEditComponent,
    SurveyResponseComponent,
    SurveyAnalyticsComponent
  ]
})
export class SurveyModule { } 