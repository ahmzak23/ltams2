const mysql = require('mysql2/promise');
const { logger } = require('../logger');

class DatabaseService {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  async query(sql, params) {
    try {
      const [results] = await this.pool.execute(sql, params);
      return results;
    } catch (error) {
      logger.error('Database query error:', error);
      throw error;
    }
  }

  async getSurveys() {
    return this.query('SELECT * FROM surveys ORDER BY created_at DESC');
  }

  async getSurveyById(id) {
    const results = await this.query('SELECT * FROM surveys WHERE id = ?', [id]);
    return results[0];
  }

  async createSurvey(survey) {
    const { id, title, description, questions } = survey;
    await this.query(
      'INSERT INTO surveys (id, title, description, questions) VALUES (?, ?, ?, ?)',
      [id, title, description, JSON.stringify(questions)]
    );
    return this.getSurveyById(id);
  }

  async updateSurvey(id, survey) {
    const { title, description, questions } = survey;
    await this.query(
      'UPDATE surveys SET title = ?, description = ?, questions = ? WHERE id = ?',
      [title, description, JSON.stringify(questions), id]
    );
    return this.getSurveyById(id);
  }

  async deleteSurvey(id) {
    await this.query('DELETE FROM surveys WHERE id = ?', [id]);
  }
}

module.exports = new DatabaseService(); 