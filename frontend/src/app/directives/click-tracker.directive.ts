import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { LoggingService } from '../services/logging.service';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appClickTracker]'
})
export class ClickTrackerDirective {
  @Input() appClickTracker: string = '';

  constructor(
    private el: ElementRef,
    private loggingService: LoggingService,
    private authService: AuthService
  ) {}

  @HostListener('click')
  onClick(): void {
    const currentUser = this.authService.currentUser$.value;
    this.loggingService.logBusinessEvent('USER_CLICK', currentUser?.id, {
      session_id: localStorage.getItem('sessionId') || undefined,
      additional: {
        element_id: this.el.nativeElement.id,
        element_type: this.el.nativeElement.tagName,
        element_text: this.el.nativeElement.textContent?.trim(),
        tracking_id: this.appClickTracker,
        timestamp: new Date().toISOString()
      }
    });
  }
} 