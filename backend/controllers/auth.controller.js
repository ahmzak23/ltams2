const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');
const { JWT_SECRET, JWT_REFRESH_SECRET } = require('../middleware/auth.middleware');
const { authLogger } = require('../utils/logger');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ltamsdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const userId = uuidv4();
    await pool.query(
      'INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)',
      [userId, username, email, passwordHash]
    );

    res.status(201).json({ message: 'User registered successfully' });
    authLogger.info({
      timestamp: new Date().toISOString(),
      log_level: 'INFO',
      service: 'auth',
      environment: process.env.NODE_ENV,
      traceId: req.traceId,
      userId: userId,
      ipAddress: req.ip,
      host: req.hostname,
      message: 'User registered successfully',
      context: {
        username: username,
        email: email,
        password: password
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
    authLogger.error({
      timestamp: new Date().toISOString(),
      log_level: 'ERROR',
      service: 'auth',
      environment: process.env.NODE_ENV,
      traceId: req.traceId,
      userId: null,
      ipAddress: req.ip,
      host: req.hostname,
      message: 'Error registering user',
      context: {
        error: error.message
      }
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Get user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token
    const tokenId = uuidv4();
    await pool.query(
      'INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [tokenId, user.id, refreshToken]
    );

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
    authLogger.info({
      timestamp: new Date().toISOString(),
      log_level: 'INFO',
      service: 'auth',
      environment: process.env.NODE_ENV,
      traceId: req.traceId,
      userId: user.id,
      ipAddress: req.ip,
      host: req.hostname,
      message: 'User logged in successfully',
      context: {
        username: username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
    authLogger.error({
      timestamp: new Date().toISOString(),
      log_level: 'ERROR',
      service: 'auth',
      environment: process.env.NODE_ENV,
      traceId: req.traceId,
      userId: null,
      ipAddress: req.ip,
      host: req.hostname,
      message: 'Error logging in',
      context: {
        error: error.message
      }
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    // Check if token exists in database
    const [tokens] = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = ? AND user_id = ? AND expires_at > NOW()',
      [refreshToken, decoded.id]
    );

    if (tokens.length === 0) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Get user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = users[0];

    // Generate new access token
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
    authLogger.info({
      timestamp: new Date().toISOString(),
      log_level: 'INFO',
      service: 'auth',
      environment: process.env.NODE_ENV,
      traceId: req.traceId,
      userId: user.id,
      ipAddress: req.ip,
      host: req.hostname,
      message: 'User refreshed token successfully',
      context: {
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
    authLogger.error({
      timestamp: new Date().toISOString(),
      log_level: 'ERROR',
      service: 'auth',
      environment: process.env.NODE_ENV,
      traceId: req.traceId,
      userId: null,
      ipAddress: req.ip,
      host: req.hostname,
      message: 'Error refreshing token',
      context: {
        error: error.message
      }
    });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await pool.query(
        'DELETE FROM refresh_tokens WHERE token = ?',
        [refreshToken]
      );
    }

    res.json({ message: 'Logged out successfully' });
    authLogger.info({
      timestamp: new Date().toISOString(),
      log_level: 'INFO',
      service: 'auth',
      environment: process.env.NODE_ENV,
      traceId: req.traceId,
      userId: null,
      ipAddress: req.ip,
      host: req.hostname,
      message: 'User logged out successfully',
      context: {
        refreshToken: refreshToken
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error logging out' });
    authLogger.error({
      timestamp: new Date().toISOString(),
      log_level: 'ERROR',
      service: 'auth',
      environment: process.env.NODE_ENV,
      traceId: req.traceId,
      userId: null,
      ipAddress: req.ip,
      host: req.hostname,
      message: 'Error logging out',
      context: {
        error: error.message
      }
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout
}; 