const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'ltamsdb',
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