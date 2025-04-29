const mysql = require('mysql2/promise');

async function checkUsers() {
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

    // Get all users
    const [users] = await connection.query('SELECT id, username, email, role, created_at, updated_at FROM users');
    
    console.log('\nUsers in database:');
    console.log(users);

    await connection.end();
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
}

checkUsers(); 