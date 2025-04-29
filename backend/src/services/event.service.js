const { logger } = require('../logger');
const { v4: uuidv4 } = require('uuid');
const os = require('os');

class EventService {
  constructor() {
    this.events = [];
    this.hostname = os.hostname();
  }

  createEvent({
    eventType,
    eventCategory,
    userId = null,
    correlationId = null,
    requestId = null,
    ipAddress = null,
    eventData = {},
    eventOutcome = 'success',
    processingTimeMs = null
  }) {
    const startTime = process.hrtime();
    
    const event = {
      timestamp: new Date().toISOString(),
      event_type: eventType,
      event_category: eventCategory,
      environment: process.env.NODE_ENV || 'development',
      service: process.env.SERVICE_NAME || 'ltams-backend',
      user_id: userId,
      correlation_id: correlationId || uuidv4(),
      request_id: requestId || uuidv4(),
      ip_address: ipAddress,
      host: this.hostname,
      event_data: eventData,
      event_outcome: eventOutcome,
      processing_time_ms: processingTimeMs
    };

    // If processing time wasn't provided, calculate it
    if (!processingTimeMs) {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      event.processing_time_ms = seconds * 1000 + nanoseconds / 1000000;
    }

    // Log the event
    logger.info('Business event occurred', { event });

    // Store the event (in memory for now)
    this.events.push(event);

    return event;
  }

  // Get all events (with optional filtering)
  getEvents(filters = {}) {
    let filteredEvents = [...this.events];

    // Apply filters
    if (filters.eventType) {
      filteredEvents = filteredEvents.filter(e => e.event_type === filters.eventType);
    }
    if (filters.eventCategory) {
      filteredEvents = filteredEvents.filter(e => e.event_category === filters.eventCategory);
    }
    if (filters.userId) {
      filteredEvents = filteredEvents.filter(e => e.user_id === filters.userId);
    }
    if (filters.startDate) {
      filteredEvents = filteredEvents.filter(e => new Date(e.timestamp) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filteredEvents = filteredEvents.filter(e => new Date(e.timestamp) <= new Date(filters.endDate));
    }

    return filteredEvents;
  }

  // Get events in Prometheus format
  getPrometheusMetrics() {
    const metrics = {};
    
    // Count events by type
    this.events.forEach(event => {
      const metricName = `business_event_${event.event_type}_total`;
      metrics[metricName] = (metrics[metricName] || 0) + 1;
    });

    // Calculate average processing time by event type
    const processingTimes = {};
    this.events.forEach(event => {
      if (!processingTimes[event.event_type]) {
        processingTimes[event.event_type] = [];
      }
      processingTimes[event.event_type].push(event.processing_time_ms);
    });

    let output = '';
    
    // Event counts
    Object.entries(metrics).forEach(([metric, value]) => {
      output += `# HELP ${metric} Total number of ${metric.replace(/_/g, ' ')}\n`;
      output += `# TYPE ${metric} counter\n`;
      output += `${metric} ${value}\n`;
    });

    // Processing times
    Object.entries(processingTimes).forEach(([eventType, times]) => {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const metricName = `business_event_${eventType}_processing_time_ms`;
      output += `# HELP ${metricName} Average processing time for ${eventType}\n`;
      output += `# TYPE ${metricName} gauge\n`;
      output += `${metricName} ${avg}\n`;
    });

    return output;
  }
}

module.exports = new EventService(); 