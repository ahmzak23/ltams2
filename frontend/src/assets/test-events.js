// Test script to generate sample business events
function generateTestEvents() {
    const users = ['user1', 'user2', 'user3'];
    const events = [
        {
            type: 'USER_LOGIN',
            data: (userId) => ({
                user_id: userId,
                success: true,
                login_duration_ms: Math.floor(Math.random() * 1000),
                login_method: 'password'
            })
        },
        {
            type: 'USER_LOGOUT',
            data: (userId) => ({
                user_id: userId,
                session_duration_ms: Math.floor(Math.random() * 3600000)
            })
        },
        {
            type: 'SURVEY_CREATED',
            data: (userId) => ({
                survey_id: Math.random().toString(36).substring(7),
                user_id: userId,
                title: `Test Survey ${Math.floor(Math.random() * 100)}`,
                question_count: Math.floor(Math.random() * 10) + 1
            })
        },
        {
            type: 'BUTTON_CLICK',
            data: (userId) => ({
                button_id: ['submit-btn', 'cancel-btn', 'add-question-btn'][Math.floor(Math.random() * 3)],
                user_id: userId,
                page: ['survey-creation', 'dashboard', 'settings'][Math.floor(Math.random() * 3)]
            })
        }
    ];

    // Generate events for each user
    users.forEach(userId => {
        events.forEach(eventType => {
            const logEntry = {
                timestamp: new Date().toISOString(),
                log_level: 'INFO',
                service: 'ltams_frontend',
                environment: 'development',
                traceId: Math.random().toString(36).substring(7),
                userId: userId,
                ipAddress: '127.0.0.1',
                host: 'frontend-client',
                message: `Business Event: ${eventType.type}`,
                context: {
                    session_id: Math.random().toString(36).substring(7),
                    additional: {
                        user_agent: 'Mozilla/5.0 (Test)',
                        platform: 'Test'
                    }
                },
                business_event: {
                    event_type: eventType.type,
                    event_data: eventType.data(userId)
                }
            };

            // Send event to API
            fetch('/api/logs/browser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(logEntry)
            }).catch(console.error);
        });
    });
}

// Generate events every 5 seconds
setInterval(generateTestEvents, 5000);

// Generate initial events
generateTestEvents(); 