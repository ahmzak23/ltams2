// Simple browser-compatible logger
const wrappedLogger = {
    formatMessage: (level: string, message: string, error?: Error) => {
        const logEntry = {
            timestamp: new Date().toISOString(),
            log_level: level,
            service: 'ltams_frontend',
            environment: 'development',
            host: 'frontend-client',
            message: message,
            error: error ? {
                message: error.message,
                stack: error.stack,
                name: error.name
            } : null
        };
        return JSON.stringify(logEntry);
    },

    info: (message: string) => {
        const formattedMessage = wrappedLogger.formatMessage('INFO', message);
        console.log(formattedMessage);
    },

    error: (message: string, error?: Error) => {
        const formattedMessage = wrappedLogger.formatMessage('ERROR', message, error);
        console.error(formattedMessage);
    },

    warn: (message: string) => {
        const formattedMessage = wrappedLogger.formatMessage('WARN', message);
        console.warn(formattedMessage);
    },

    debug: (message: string) => {
        const formattedMessage = wrappedLogger.formatMessage('DEBUG', message);
        console.debug(formattedMessage);
    }
};

export default wrappedLogger; 