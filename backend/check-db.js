const mysql = require('mysql2/promise');

async function checkDatabase() {
  let connection;
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: ''
    });

    // Show databases
    console.log('\nDatabases:');
    const [databases] = await connection.query('SHOW DATABASES');
    console.log(databases);

    try {
      // Use our database
      await connection.query('USE ltamsdb');

      // Show tables
      console.log('\nTables in ltamsdb:');
      const [tables] = await connection.query('SHOW TABLES');
      console.log(tables);

      if (tables.length > 0) {
        // Show table structures
        console.log('\nTable structures:');
        
        try {
          const [usersStructure] = await connection.query('DESCRIBE users');
          console.log('\nUsers table:');
          console.log(usersStructure);
        } catch (e) {
          console.log('Could not describe users table:', e.message);
        }

        try {
          const [refreshTokensStructure] = await connection.query('DESCRIBE refresh_tokens');
          console.log('\nRefresh tokens table:');
          console.log(refreshTokensStructure);
        } catch (e) {
          console.log('Could not describe refresh_tokens table:', e.message);
        }

        try {
          const [surveysStructure] = await connection.query('DESCRIBE surveys');
          console.log('\nSurveys table:');
          console.log(surveysStructure);
        } catch (e) {
          console.log('Could not describe surveys table:', e.message);
        }
      } else {
        console.log('No tables found in ltamsdb');
      }
    } catch (e) {
      console.error('Error accessing ltamsdb:', e.message);
    }
  } catch (error) {
    console.error('Error checking database:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkDatabase(); 