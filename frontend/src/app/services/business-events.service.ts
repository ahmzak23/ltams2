import { Injectable } from '@angular/core';
import logger from '../../logger';

@Injectable({
  providedIn: 'root'
})
export class BusinessEventsService {
  constructor() {}

  logLogin(userId: string, success: boolean, additionalData?: any) {
    logger.logBusinessEvent('USER_LOGIN', {
      user_id: userId,
      success: success,
      timestamp: new Date().toISOString(),
      ...additionalData
    }, {
      session_id: localStorage.getItem('sessionId') || 'unknown',
      additional: {
        user_agent: navigator.userAgent,
        platform: navigator.platform
      }
    });
  }

  logLogout(userId: string, sessionDuration: number) {
    logger.logBusinessEvent('USER_LOGOUT', {
      user_id: userId,
      session_duration_ms: sessionDuration,
      timestamp: new Date().toISOString()
    }, {
      session_id: localStorage.getItem('sessionId') || 'unknown'
    });
  }

  logSurveyCreated(surveyId: string, userId: string, surveyData: any) {
    logger.logBusinessEvent('SURVEY_CREATED', {
      survey_id: surveyId,
      user_id: userId,
      survey_data: surveyData,
      timestamp: new Date().toISOString()
    }, {
      session_id: localStorage.getItem('sessionId') || 'unknown'
    });
  }

  logButtonClick(buttonId: string, userId: string, page: string) {
    logger.logBusinessEvent('BUTTON_CLICK', {
      button_id: buttonId,
      user_id: userId,
      page: page,
      timestamp: new Date().toISOString()
    }, {
      session_id: localStorage.getItem('sessionId') || 'unknown'
    });
  }

  info(message: string, context?: any) {
    logger.info(message, context);
  }
} 