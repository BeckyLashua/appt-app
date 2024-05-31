const mysql = require('mysql2/promise');

async function initializeDatabase() {
  const pool = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'Orphan718',
    database: 'booking_system', 
    waitForConnections: true,
    connectionLimit: 10, 
  });

  console.log('Connected to your database server');

  try {
    await pool.query('CREATE DATABASE IF NOT EXISTS booking_system');
    console.log('booking_system database created or already exists');

    await pool.query('USE booking_system');

    const [rows] = await pool.query('SELECT DATABASE() AS db');
    console.log(`Current database: ${rows[0].db}`);

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS appointments (
            appt_id INT AUTO_INCREMENT PRIMARY KEY,
            client_email VARCHAR(255) NOT NULL,
            appt_date DATE NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL
        );
    `;
    await pool.query(createTableQuery);
    console.log('appointments table created or already exists');
    //return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error; 
  } finally {pool.end();}
}


module.exports = initializeDatabase;

