const logger = {
  formatMessage: (level, message, error = null) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      log_level: level,
      service: 'ltams_backend',
      environment: process.env.NODE_ENV || 'development',
      host: process.env.HOSTNAME || 'backend-server',
      message: message,
      error: error ? error.stack || error.message : null
    };
    return JSON.stringify(logEntry);
  },

  info: (message) => {
    console.log(logger.formatMessage('INFO', message));
  },

  error: (message, error) => {
    console.error(logger.formatMessage('ERROR', message, error));
  },

  warn: (message) => {
    console.warn(logger.formatMessage('WARN', message));
  },

  debug: (message) => {
    console.debug(logger.formatMessage('DEBUG', message));
  }
};

module.exports = { logger }; 