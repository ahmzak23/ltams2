const express = require('express');
const router = express.Router();
const { logger } = require('../logger');
const eventService = require('../services/event.service');

// Create a new event
router.post('/', async (req, res) => {
  try {
    const event = eventService.createEvent({
      ...req.body,
      ipAddress: req.ip
    });
    res.status(201).json(event);
  } catch (error) {
    logger.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Get events with optional filtering
router.get('/', async (req, res) => {
  try {
    const filters = {
      eventType: req.query.eventType,
      eventCategory: req.query.eventCategory,
      userId: req.query.userId,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const events = eventService.getEvents(filters);
    res.json(events);
  } catch (error) {
    logger.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get events in Prometheus format
router.get('/prometheus', async (req, res) => {
  try {
    const metrics = eventService.getPrometheusMetrics();
    res.set('Content-Type', 'text/plain');
    res.send(metrics);
  } catch (error) {
    logger.error('Error generating event metrics:', error);
    res.status(500).json({ error: 'Failed to generate event metrics' });
  }
});

module.exports = router; 