import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'frontend', 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
    console.log('Created logs directory:', logsDir);
}

// Generate a test event
function generateTestEvent(userId: string, eventType: string) {
    const eventData = {
        timestamp: new Date().toISOString(),
        log_level: 'INFO',
        service: 'ltams_frontend',
        environment: 'development',
        traceId: Math.random().toString(36).substring(7),
        userId: userId,
        ipAddress: '127.0.0.1',
        host: 'frontend-client',
        message: `Business Event: ${eventType}`,
        context: {
            session_id: Math.random().toString(36).substring(7),
            additional: {
                user_agent: 'Test Agent',
                platform: 'Test'
            }
        },
        business_event: {
            event_type: eventType,
            event_data: {
                user_id: userId,
                timestamp: new Date().toISOString(),
                // Add event-specific data
                ...(eventType === 'USER_LOGIN' && {
                    success: true,
                    login_duration_ms: Math.floor(Math.random() * 1000)
                }),
                ...(eventType === 'SURVEY_CREATED' && {
                    survey_id: Math.random().toString(36).substring(7),
                    title: `Test Survey ${Math.floor(Math.random() * 100)}`
                })
            }
        }
    };
    return eventData;
}

// Test endpoint to generate events
router.post('/test/generate', (req, res) => {
    try {
        const users = ['test_user1', 'test_user2', 'test_user3'];
        const events = ['USER_LOGIN', 'USER_LOGOUT', 'SURVEY_CREATED', 'BUTTON_CLICK'];
        const logFile = path.join(logsDir, 'browser-console.log');

        // Generate events for each user and event type
        users.forEach(userId => {
            events.forEach(eventType => {
                const eventData = generateTestEvent(userId, eventType);
                fs.appendFileSync(logFile, `${JSON.stringify(eventData)}\n`);
            });
        });

        console.log('Generated test events');
        res.status(200).json({ message: 'Test events generated successfully' });
    } catch (error) {
        console.error('Error generating test events:', error);
        res.status(500).json({ error: 'Failed to generate test events' });
    }
});

// Endpoint to receive browser logs
router.post('/browser', (req, res) => {
    try {
        console.log('Received browser log request');
        const logData = req.body;
        const logFile = path.join(logsDir, 'browser-console.log');
        
        // Ensure the log entry has a timestamp
        if (!logData.timestamp) {
            logData.timestamp = new Date().toISOString();
        }
        
        // Debug log the data
        console.log('Writing log data:', {
            file: logFile,
            data: logData
        });
        
        // Append log to file with newline
        fs.appendFileSync(logFile, `${JSON.stringify(logData)}\n`);
        console.log('Successfully wrote log to file');
        
        res.status(200).json({ message: 'Log received successfully' });
    } catch (error) {
        console.error('Error handling browser log:', error);
        res.status(500).json({ error: 'Failed to process log', details: error.message });
    }
});

export default router; 