const express = require('express');
const moment = require('moment');
const mysql = require('mysql2/promise');

const initializeDatabase = require('../database/db');

const app = express();
app.use(express.json());

const hostname = '127.0.0.1';
const port = 3001;

const cors = require('cors');
app.use(cors());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: 'Orphan718', 
  database: 'booking_system', 
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0
});



// helper functions 

async function isApptAvailable(connection, apptDate, startTime, endTime) {
  const query = `
    SELECT COUNT(*) as count
    FROM appointments
    WHERE appt_date = ? AND (start_time <= ? AND end_time >= ?)
  `; 

  const [rows] = await connection.execute(query, [apptDate, endTime, startTime]);
  return rows[0].count == 0;
}


async function createAppointmentInDatabase(data) {
  const formattedStartTime = moment(data.start_time, 'HH:mm').format('HH:mm');
  const endTime = moment(data.start_time, 'HH:mm').add(30, 'minutes').format('HH:mm');
  await pool.beginTransaction;

  try {
    const available = await isApptAvailable(pool, data.appt_date, formattedStartTime, endTime);
    if (!available) {throw new Error('The appointment time is already booked.');}
    
    const query = `
      INSERT INTO appointments (client_email, appt_date, start_time, end_time)
      VALUES (?, ?, ?, ?);
    `;

    const values = [data.client_email, data.appt_date, formattedStartTime, endTime];
    const [result] = await pool.execute(query, values);

    const newAppointment = {
      appt_id: result.insertId,  
      ...data
    };
    
    return newAppointment;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error; // Rethrow to handle it in the route handler
  }
}


async function updateAppointmentInDatabase(id, data) {
  const formattedStartTime = moment(data.start_time, 'HH:mm').format('HH:mm');
  const endTime = moment(data.start_time, 'HH:mm').add(30, 'minutes').format('HH:mm');
  await pool.beginTransaction;

  const query = `
    UPDATE appointments
    SET appt_date = ?, start_time = ?, end_time = ?
    WHERE appt_id = ?;
  `;

  try {
    const available = await isApptAvailable(pool, data.appt_date, formattedStartTime, endTime);
    if (!available) {throw new Error('The appointment time is already booked.');}
    
    const [result] = await pool.execute(query, [data.appt_date, formattedStartTime, endTime, id]);
    if (result.affectedRows > 0) {
        console.log('Appointment updated successfully');
        return { id, ...data };
    } else {
        console.log('No appointment found with the specified id');
    }
  } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
  }
}


async function deleteAppointmentFromDatabase(id) {
  const query = `
    DELETE FROM appointments WHERE appt_id = ?;
  `;

  try {
    const [result] = await pool.execute(query, [id]);
        if (result.affectedRows > 0) {
            console.log('Appointment deleted successfully');
        } else {
            console.log('No appointment found with the specified ID, or it was already deleted');
        }
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
}

// home page route handler
app.get('/api/message', async (req, res) => {
  try {
    res.json({ message: 'Server is connected!' });
  } catch (error) {
    console.error('Failed to send message:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/api/appts/:client_email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.client_email);
    const query = 'SELECT * FROM appointments WHERE client_email = ?';
    const [appts] = await pool.query(query, [email]);

    res.status(200).json({
      message: 'Appointments retrieved successfully',
      appts: appts
    });
  } catch (error) {
    console.error('Failed to find appointments:', error);
    res.status(500).send('Internal Server Error');
  } 
});


// booking page handler
app.post('/api/appts', async (req, res) => {
  const appointmentData = req.body; // Data sent from the client
  console.log(appointmentData);

  // Simulate database insertion and generate a mock ID
  createAppointmentInDatabase(appointmentData)
      .then(newAppointment => {
          res.status(201).json({
              message: 'Congratulations! You have successfully booked this appointment!',
              appointment: newAppointment
          });
      })
      .catch(error => {
        if (error.message === 'The appointment time is already booked.') {
          res.status(409).json({ message: 'Sorry. This appointment time is already booked. Choose another time.' });
        } else {
          res.status(500).json({ message: 'An error occurred while creating this appointment.' });
        }
      });
});

// reschedule page handler
// mock the response to a database update
app.patch('/api/appts/:id', async (req, res) => {
  const { id } = req.params;
  const appointmentData = req.body; // data sent from the client to update the appointment

  // Assuming you have a database method to update an appointment
  updateAppointmentInDatabase(id, appointmentData)
      .then(updatedAppointment => {
          res.json({
              message: 'Appointment updated successfully',
              appointment: updatedAppointment
          });
      })
      .catch(error => {
        if (error.message === 'The appointment time is already booked.') {
          res.status(409).json({ message: 'Sorry. This appointment time is already booked. Choose another time.' });
        } else {
          res.status(500).json({ message: 'An error occurred while attempting to reschedule this appointment.' });
        }
      });
});

// cancel handler
// mock the response to a database delete
app.delete('/api/appts/:id', async (req, res) => {
  const { id } = req.params;
  // Assuming you have a database method to delete an appointment
  deleteAppointmentFromDatabase(id)
    .then(() => {
        res.send(`Appointment with id ${id} deleted successfully`);
    })
    .catch(error => {
        console.error('Failed to delete appointment:', error);
        res.status(500).send('Internal Server Error');
    });
});


initializeDatabase().then(() => {
  app.listen(port, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1); 
});
