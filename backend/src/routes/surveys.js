const express = require('express');
const router = express.Router();
const { logger } = require('../logger');
const db = require('../services/database.service');
const { v4: uuidv4 } = require('uuid');

// Get all surveys
router.get('/', async (req, res) => {
  try {
    const surveys = await db.getSurveys();
    res.json(surveys);
  } catch (error) {
    logger.error('Error fetching surveys:', error);
    res.status(500).json({ error: 'Failed to fetch surveys' });
  }
});

// Get survey by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const survey = await db.getSurveyById(id);
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    res.json(survey);
  } catch (error) {
    logger.error(`Error fetching survey ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch survey' });
  }
});

// Create new survey
router.post('/', async (req, res) => {
  try {
    const survey = {
      id: uuidv4(),
      ...req.body
    };
    const createdSurvey = await db.createSurvey(survey);
    res.status(201).json(createdSurvey);
  } catch (error) {
    logger.error('Error creating survey:', error);
    res.status(500).json({ error: 'Failed to create survey' });
  }
});

// Update survey
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const survey = req.body;
    const updatedSurvey = await db.updateSurvey(id, survey);
    if (!updatedSurvey) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    res.json(updatedSurvey);
  } catch (error) {
    logger.error(`Error updating survey ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update survey' });
  }
});

// Delete survey
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteSurvey(id);
    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting survey ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete survey' });
  }
});

module.exports = router; 