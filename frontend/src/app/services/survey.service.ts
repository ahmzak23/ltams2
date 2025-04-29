import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Survey {
  id?: string;
  title: string;
  description: string;
  questions: Question[];
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive: boolean;
  settings: SurveySettings;
}

export interface Question {
  id?: string;
  type: 'text' | 'multiple-choice' | 'checkbox' | 'rating' | 'date';
  text: string;
  required: boolean;
  options?: string[];
  minRating?: number;
  maxRating?: number;
}

export interface SurveySettings {
  allowAnonymous: boolean;
  requireAuthentication: boolean;
  showProgressBar: boolean;
  allowMultipleResponses: boolean;
  expirationDate?: Date;
}

export interface SurveyResponse {
  id?: string;
  surveyId: string;
  answers: Answer[];
  respondentId?: string;
  submittedAt: Date;
}

export interface Answer {
  questionId: string;
  value: any;
}

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private apiUrl = `${environment.apiUrl}/api/surveys`;

  constructor(private http: HttpClient) {}

  getSurveys(): Observable<Survey[]> {
    return this.http.get<Survey[]>(this.apiUrl);
  }

  getSurvey(id: string): Observable<Survey> {
    return this.http.get<Survey>(`${this.apiUrl}/${id}`);
  }

  createSurvey(survey: Survey): Observable<Survey> {
    return this.http.post<Survey>(this.apiUrl, survey);
  }

  updateSurvey(id: string, survey: Survey): Observable<Survey> {
    return this.http.put<Survey>(`${this.apiUrl}/${id}`, survey);
  }

  deleteSurvey(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  submitResponse(surveyId: string, response: SurveyResponse): Observable<SurveyResponse> {
    return this.http.post<SurveyResponse>(`${this.apiUrl}/${surveyId}/responses`, response);
  }

  getResponses(surveyId: string): Observable<SurveyResponse[]> {
    return this.http.get<SurveyResponse[]>(`${this.apiUrl}/${surveyId}/responses`);
  }

  getAnalytics(surveyId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${surveyId}/analytics`);
  }
} 