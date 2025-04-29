const express = require('express');
const router = express.Router();
const surveys = require('../controllers/survey.controller');

// Create a new survey
router.post('/', surveys.create);

// Get all surveys
router.get('/', surveys.findAll);

// Get a single survey
router.get('/:id', surveys.findOne);

// Update a survey
router.put('/:id', surveys.update);

// Delete a survey
router.delete('/:id', surveys.delete);

module.exports = router; 