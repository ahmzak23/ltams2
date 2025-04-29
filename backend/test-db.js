const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'ltamsdb'
});

console.log('Attempting to connect to MySQL...');

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    process.exit(1);
  }
  console.log('Successfully connected to MySQL database!');

  // Test queries
  console.log('\nChecking database tables...');
  connection.query('SHOW TABLES', (err, results) => {
    if (err) {
      console.error('Error executing SHOW TABLES:', err);
      process.exit(1);
    }
    console.log('Tables in database:', results);

    console.log('\nChecking surveys table structure...');
    connection.query('DESCRIBE surveys', (err, results) => {
      if (err) {
        console.error('Error executing DESCRIBE surveys:', err);
        process.exit(1);
      }
      console.log('Surveys table structure:', results);

      // Close connection
      connection.end((err) => {
        if (err) {
          console.error('Error closing connection:', err);
          process.exit(1);
        }
        console.log('\nConnection closed successfully.');
      });
    });
  });
}); 