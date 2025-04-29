const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { pool, testConnection } = require('./config/database');
const logger = require('./utils/logger');
const { verifyToken, verifyAdmin } = require('./middleware/auth.middleware');
const authRoutes = require('./routes/auth.routes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test database connection on startup
testConnection()
  .then(() => {
    logger.info('Database connection successful');
  })
  .catch(err => {
    logger.error('Database connection failed:', { error: err.message });
    // You might want to exit the process here depending on your requirements
    // process.exit(1);
  });

// Basic health check endpoint
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: err.message });
  }
});

// Auth routes
app.use('/api/auth', authRoutes);

// Protected Survey routes
app.get('/api/surveys', verifyToken, async (req, res) => {
  try {
    const [surveys] = await pool.query('SELECT * FROM surveys');
    logger.info('Fetched all surveys', { count: surveys.length });
    res.json(surveys);
  } catch (error) {
    logger.error('Error fetching surveys', { message: error.message, error: error.bodyParser });
    res.status(500).json({ message: 'Error fetching surveys', error: error.message });
  }
});

app.get('/api/surveys/:id', verifyToken, async (req, res) => {
  try {
    const [surveys] = await pool.query('SELECT * FROM surveys WHERE id = ?', [req.params.id]);
    if (surveys.length === 0) {
      logger.warn('Survey not found', { surveyId: req.params.id });
      return res.status(404).json({ message: 'Survey not found' });
    }
    logger.info('Fetched survey by id', { surveyId: req.params.id });
    res.json(surveys[0]);
  } catch (error) {
    logger.error('Error fetching survey', { surveyId: req.params.id, error: error.message });
    res.status(500).json({ message: 'Error fetching survey', error: error.message });
  }
});

app.post('/api/surveys', verifyToken, async (req, res) => {
  try {
    logger.info('Creating new survey', { title: req.body.title });
    const survey = {
      id: Date.now().toString(),
      title: req.body.title,
      description: req.body.description,
      questions: JSON.stringify(req.body.questions || []),
      created_by: req.user.id
    };

    const [result] = await pool.query(
      'INSERT INTO surveys (id, title, description, questions, created_by) VALUES (?, ?, ?, ?, ?)',
      [survey.id, survey.title, survey.description, survey.questions, survey.created_by]
    );
    logger.info('Survey created successfully', { surveyId: survey.id });

    const [newSurvey] = await pool.query('SELECT * FROM surveys WHERE id = ?', [survey.id]);
    res.status(201).json(newSurvey[0]);
  } catch (error) {
    logger.error('Error creating survey', { error: error.message });
    res.status(500).json({ message: 'Error creating survey', error: error.message });
  }
});

app.put('/api/surveys/:id', verifyToken, async (req, res) => {
  try {
    logger.info('Updating survey', { surveyId: req.params.id });
    const { title, description, questions } = req.body;

    // Check if user is admin or the creator of the survey
    const [surveys] = await pool.query('SELECT created_by FROM surveys WHERE id = ?', [req.params.id]);
    if (surveys.length === 0) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (surveys[0].created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this survey' });
    }

    const [result] = await pool.query(
      'UPDATE surveys SET title = ?, description = ?, questions = ? WHERE id = ?',
      [title, description, JSON.stringify(questions), req.params.id]
    );

    const [updatedSurvey] = await pool.query('SELECT * FROM surveys WHERE id = ?', [req.params.id]);
    logger.info('Survey updated successfully', { surveyId: req.params.id });
    res.json(updatedSurvey[0]);
  } catch (error) {
    logger.error('Error updating survey', { surveyId: req.params.id, error: error.message });
    res.status(500).json({ message: 'Error updating survey', error: error.message });
  }
});

app.delete('/api/surveys/:id', verifyToken, async (req, res) => {
  try {
    logger.info('Deleting survey', { surveyId: req.params.id });

    // Check if user is admin or the creator of the survey
    const [surveys] = await pool.query('SELECT created_by FROM surveys WHERE id = ?', [req.params.id]);
    if (surveys.length === 0) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (surveys[0].created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this survey' });
    }

    const [result] = await pool.query('DELETE FROM surveys WHERE id = ?', [req.params.id]);
    logger.info('Survey deleted successfully', { surveyId: req.params.id });
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting survey', { surveyId: req.params.id, error: error.message });
    res.status(500).json({ message: 'Error deleting survey', error: error.message });
  }
});

// Start server
app.listen(port, () => {
  logger.info(`Backend server listening on port ${port}`);
}); 