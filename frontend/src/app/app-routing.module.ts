import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SurveyListComponent } from './survey/survey-list/survey-list.component';
import { SurveyCreateComponent } from './survey/survey-create/survey-create.component';
import { SurveyEditComponent } from './survey/survey-edit/survey-edit.component';
import { SurveyResponseComponent } from './survey/survey-response/survey-response.component';
import { SurveyAnalyticsComponent } from './survey/survey-analytics/survey-analytics.component';
import { MetricsDashboardComponent } from './components/metrics-dashboard/metrics-dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'surveys', component: SurveyListComponent, canActivate: [AuthGuard] },
  { path: 'surveys/create', component: SurveyCreateComponent, canActivate: [AuthGuard] },
  { path: 'surveys/edit/:id', component: SurveyEditComponent, canActivate: [AuthGuard] },
  { path: 'surveys/:id/responses', component: SurveyResponseComponent, canActivate: [AuthGuard] },
  { path: 'surveys/:id/analytics', component: SurveyAnalyticsComponent, canActivate: [AuthGuard] },
  { path: 'metrics', component: MetricsDashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 