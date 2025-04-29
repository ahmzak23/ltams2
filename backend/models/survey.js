const db = require('../config/database');

class Survey {
  constructor(survey) {
    this.title = survey.title;
    this.description = survey.description;
    this.questions = typeof survey.questions === 'string' ? survey.questions : JSON.stringify(survey.questions);
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  static create(newSurvey, result) {
    db.query(
      'INSERT INTO surveys SET ?',
      newSurvey,
      (err, res) => {
        if (err) {
          console.error('Error creating survey:', err);
          result(err, null);
          return;
        }
        
        // Parse the questions back to JSON for the response
        const createdSurvey = { ...newSurvey };
        createdSurvey.questions = JSON.parse(newSurvey.questions);
        result(null, { id: res.insertId, ...createdSurvey });
      }
    );
  }

  static getAll(result) {
    db.query('SELECT * FROM surveys', (err, res) => {
      if (err) {
        console.error('Error getting surveys:', err);
        result(err, null);
        return;
      }
      
      // Parse questions JSON for each survey
      const surveys = res.map(survey => ({
        ...survey,
        questions: JSON.parse(survey.questions)
      }));
      result(null, surveys);
    });
  }

  static getById(surveyId, result) {
    db.query(
      'SELECT * FROM surveys WHERE id = ?',
      [surveyId],
      (err, res) => {
        if (err) {
          console.error('Error getting survey:', err);
          result(err, null);
          return;
        }
        if (res.length) {
          const survey = res[0];
          survey.questions = JSON.parse(survey.questions);
          result(null, survey);
          return;
        }
        result({ kind: 'not_found' }, null);
      }
    );
  }

  static update(id, survey, result) {
    const questions = typeof survey.questions === 'string' ? survey.questions : JSON.stringify(survey.questions);
    db.query(
      'UPDATE surveys SET title = ?, description = ?, questions = ? WHERE id = ?',
      [survey.title, survey.description, questions, id],
      (err, res) => {
        if (err) {
          console.error('Error updating survey:', err);
          result(err, null);
          return;
        }
        if (res.affectedRows == 0) {
          result({ kind: 'not_found' }, null);
          return;
        }
        
        const updatedSurvey = {
          id,
          title: survey.title,
          description: survey.description,
          questions: typeof questions === 'string' ? JSON.parse(questions) : questions
        };
        result(null, updatedSurvey);
      }
    );
  }

  static delete(id, result) {
    db.query(
      'DELETE FROM surveys WHERE id = ?',
      [id],
      (err, res) => {
        if (err) {
          console.error('Error deleting survey:', err);
          result(err, null);
          return;
        }
        if (res.affectedRows == 0) {
          result({ kind: 'not_found' }, null);
          return;
        }
        result(null, { id: id });
      }
    );
  }
}

module.exports = Survey; 