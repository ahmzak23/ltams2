const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'ltamsdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Convert pool to use promises
const promisePool = pool.promise();

// Test connection
const testConnection = async () => {
  try {
    await promisePool.query('SELECT 1');
    console.log('MySQL connection pool initialized successfully');
  } catch (err) {
    console.error('Error initializing MySQL connection pool:', err);
    // Don't exit the process, let the application handle the error
    throw err;
  }
};

// Export both the pool and the test function
module.exports = {
  pool: promisePool,
  testConnection
}; 