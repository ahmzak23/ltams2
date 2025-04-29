const eventService = require('../services/event.service');

// Sample data for event generation
const eventTypes = [
  'user_registration',
  'user_login',
  'user_logout',
  'survey_created',
  'survey_submitted',
  'survey_deleted',
  'report_generated',
  'payment_processed',
  'email_sent',
  'notification_sent'
];

const eventCategories = [
  'user_management',
  'survey_management',
  'analytics',
  'communication',
  'payment'
];

const users = Array.from({ length: 20 }, (_, i) => `user_${i + 1}`);
const outcomes = ['success', 'failure', 'pending'];

// Helper function to get random item from array
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Helper function to get random number between min and max
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate a random event
const generateRandomEvent = () => {
  const eventType = getRandomItem(eventTypes);
  const eventCategory = getRandomItem(eventCategories);
  const userId = getRandomItem(users);
  const outcome = getRandomItem(outcomes);
  const processingTime = getRandomNumber(50, 500);

  // Generate event-specific data
  let eventData = {};
  switch (eventType) {
    case 'user_registration':
      eventData = {
        registration_source: getRandomItem(['web', 'mobile', 'api']),
        user_type: getRandomItem(['standard', 'premium', 'enterprise']),
        referred_by: getRandomItem(['marketing_campaign', 'referral', 'organic'])
      };
      break;
    case 'survey_created':
    case 'survey_submitted':
      eventData = {
        survey_id: `survey_${getRandomNumber(1, 100)}`,
        survey_type: getRandomItem(['feedback', 'assessment', 'quiz']),
        question_count: getRandomNumber(5, 20)
      };
      break;
    case 'payment_processed':
      eventData = {
        amount: getRandomNumber(10, 1000),
        currency: getRandomItem(['USD', 'EUR', 'GBP']),
        payment_method: getRandomItem(['credit_card', 'paypal', 'bank_transfer'])
      };
      break;
    default:
      eventData = {
        action: eventType,
        timestamp: new Date().toISOString()
      };
  }

  return {
    eventType,
    eventCategory,
    userId,
    eventData,
    eventOutcome: outcome,
    processingTimeMs: processingTime
  };
};

// Generate events at random intervals
const generateEvents = async (duration = 300000, maxInterval = 2000) => {
  const startTime = Date.now();
  
  console.log('Starting event generation...');
  
  while (Date.now() - startTime < duration) {
    const event = generateRandomEvent();
    eventService.createEvent(event);
    
    // Random delay between events (up to maxInterval ms)
    const delay = Math.random() * maxInterval;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  console.log('Event generation completed.');
};

// Start generating events for 5 minutes
generateEvents(); 