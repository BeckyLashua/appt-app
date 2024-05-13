const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Orphan718',
  database: 'booking_system'
});

connection.connect(error => {
  if (error) {
    return console.error('Error connecting to the database: ' + error.message);
  }
  console.log('Connected to the MariaDB/MySQL server.');
  connection.end(); // close the connection
});
