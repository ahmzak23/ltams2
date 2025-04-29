import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BusinessEvent {
  event_type: string;
  event_category: string;
  user_id?: string;
  correlation_id?: string;
  request_id?: string;
  event_data?: any;
  event_outcome?: 'success' | 'failure' | 'pending';
  processing_time_ms?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/api/events`;

  constructor(private http: HttpClient) {}

  // Create a new business event
  createEvent(event: BusinessEvent): Observable<BusinessEvent> {
    const startTime = performance.now();
    
    // Add processing time if not provided
    if (!event.processing_time_ms) {
      event.processing_time_ms = performance.now() - startTime;
    }

    return this.http.post<BusinessEvent>(this.apiUrl, event);
  }

  // Get events with optional filtering
  getEvents(filters?: {
    eventType?: string;
    eventCategory?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }): Observable<BusinessEvent[]> {
    return this.http.get<BusinessEvent[]>(this.apiUrl, { params: { ...filters } });
  }

  // Helper methods for common event types
  trackUserAction(action: string, userId: string, data: any = {}): Observable<BusinessEvent> {
    return this.createEvent({
      event_type: action,
      event_category: 'user_action',
      user_id: userId,
      event_data: data
    });
  }

  trackPageView(page: string, userId?: string): Observable<BusinessEvent> {
    return this.createEvent({
      event_type: 'page_view',
      event_category: 'analytics',
      user_id: userId,
      event_data: { page }
    });
  }

  trackError(error: Error, userId?: string): Observable<BusinessEvent> {
    return this.createEvent({
      event_type: 'error',
      event_category: 'error',
      user_id: userId,
      event_data: {
        error_name: error.name,
        error_message: error.message,
        error_stack: error.stack
      },
      event_outcome: 'failure'
    });
  }

  trackFeatureUsage(feature: string, userId?: string, data: any = {}): Observable<BusinessEvent> {
    return this.createEvent({
      event_type: 'feature_usage',
      event_category: 'analytics',
      user_id: userId,
      event_data: {
        feature,
        ...data
      }
    });
  }
} 