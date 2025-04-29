const mysql = require('mysql2/promise');

async function fixSurveysTable() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: ''
    });

    // Use our database
    await connection.query('USE ltamsdb');

    // Drop the existing surveys table
    console.log('Dropping existing surveys table...');
    await connection.query('DROP TABLE IF EXISTS surveys');

    // Create surveys table with correct schema
    console.log('Creating surveys table with correct schema...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS surveys (
        id VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        questions JSON,
        created_by VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    console.log('Surveys table updated successfully');
    await connection.end();
  } catch (error) {
    console.error('Error fixing surveys table:', error);
    process.exit(1);
  }
}

fixSurveysTable(); 