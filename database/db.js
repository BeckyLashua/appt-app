const mysql = require('mysql2/promise');

async function initializeDatabase() {
  try {
    const connection = await mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'Orphan718',
      database: 'booking_system',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error; // or handle error as needed
  }
}

module.exports = initializeDatabase;

