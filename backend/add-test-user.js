const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function addTestUser() {
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

    // Generate UUID for user
    const userId = uuidv4();
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('123', salt);

    // Insert admin user
    const [result] = await connection.query(
      'INSERT INTO users (id, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [userId, 'admin', 'admin@example.com', passwordHash, 'admin']
    );

    console.log('Test admin user created successfully');
    console.log('Username: admin');
    console.log('Password: 123');
    console.log('User ID:', userId);

    await connection.end();
  } catch (error) {
    console.error('Error adding test user:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('User with username "admin" already exists');
    }
    process.exit(1);
  }
}

addTestUser(); 