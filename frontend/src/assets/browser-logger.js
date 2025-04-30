// Override console methods to capture logs
const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    debug: console.debug
};

// Function to write logs to file
function writeToLogFile(message) {
    // Only write if the message is a JSON string (our business events)
    try {
        const parsed = JSON.parse(message);
        if (parsed.business_event) {
            // Debug log
            originalConsole.log('Sending business event to server:', parsed);
            
            // Send to server endpoint that will write to file
            fetch('/api/logs/browser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: message
            })
            .then(response => {
                originalConsole.log('Log sent successfully:', response.status);
            })
            .catch(err => {
                originalConsole.error('Failed to send log to server:', err);
            });
        }
    } catch (e) {
        // Not a JSON string, ignore
        originalConsole.log('Ignoring non-JSON message:', message);
    }
}

// Override console methods
console.log = function() {
    originalConsole.log.apply(console, arguments);
    if (arguments[0] && typeof arguments[0] === 'string') {
        writeToLogFile(arguments[0]);
    }
};

console.error = function() {
    originalConsole.error.apply(console, arguments);
    if (arguments[0] && typeof arguments[0] === 'string') {
        writeToLogFile(arguments[0]);
    }
};

console.warn = function() {
    originalConsole.warn.apply(console, arguments);
    if (arguments[0] && typeof arguments[0] === 'string') {
        writeToLogFile(arguments[0]);
    }
};

console.debug = function() {
    originalConsole.debug.apply(console, arguments);
    if (arguments[0] && typeof arguments[0] === 'string') {
        writeToLogFile(arguments[0]);
    }
}; 