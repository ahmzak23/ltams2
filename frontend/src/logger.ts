// Enhanced browser-compatible logger with business events
import { v4 as uuidv4 } from 'uuid';

interface LogContext {
    session_id?: string;
    additional?: Record<string, any>;
}

interface LogError {
    type?: string;
    message?: string;
    stackTrace?: string;
    error_code?: string;
    http_status_code?: number;
}

interface BusinessEvent {
    event_type: string;
    event_data: Record<string, any>;
}

const wrappedLogger = {
    formatMessage: (
        level: string,
        message: string,
        context?: LogContext,
        error?: LogError,
        businessEvent?: BusinessEvent
    ) => {
        const logEntry = {
            timestamp: new Date().toISOString(),
            log_level: level,
            service: 'ltams_frontend',
            environment: 'development',
            traceId: uuidv4(),
            userId: localStorage.getItem('userId') || 'anonymous',
            ipAddress: window.location.hostname,
            host: 'frontend-client',
            message: message,
            context: {
                session_id: localStorage.getItem('sessionId') || 'unknown',
                ...context
            },
            error: error ? {
                type: error.type,
                message: error.message,
                stackTrace: error.stackTrace,
                error_code: error.error_code,
                http_status_code: error.http_status_code
            } : null,
            business_event: businessEvent || null
        };
        return JSON.stringify(logEntry);
    },

    info: (message: string, context?: LogContext) => {
        const formattedMessage = wrappedLogger.formatMessage('INFO', message, context);
        console.log(formattedMessage);
    },

    error: (message: string, error?: LogError, context?: LogContext) => {
        const formattedMessage = wrappedLogger.formatMessage('ERROR', message, context, error);
        console.error(formattedMessage);
    },

    warn: (message: string, context?: LogContext) => {
        const formattedMessage = wrappedLogger.formatMessage('WARN', message, context);
        console.warn(formattedMessage);
    },

    debug: (message: string, context?: LogContext) => {
        const formattedMessage = wrappedLogger.formatMessage('DEBUG', message, context);
        console.debug(formattedMessage);
    },

    // Business Event Logging
    logBusinessEvent: (eventType: string, eventData: Record<string, any>, context?: LogContext) => {
        const businessEvent: BusinessEvent = {
            event_type: eventType,
            event_data: eventData
        };
        const formattedMessage = wrappedLogger.formatMessage(
            'INFO',
            `Business Event: ${eventType}`,
            context,
            undefined,
            businessEvent
        );
        console.log(formattedMessage);
    }
};

export default wrappedLogger; 