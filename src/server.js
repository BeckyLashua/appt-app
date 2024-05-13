const express = require('express');
const app = express();
app.use(express.json());

const hostname = '127.0.0.1';
const port = 3001;

const cors = require('cors');
app.use(cors());

// helper functions 
function createAppointmentInDatabase(data) {
  // This would typically involve a database call like:
  // return Database.insert('appointments', data);
  const mockId = Math.floor(Math.random() * 10000); // Generate a mock ID for the example
  return Promise.resolve({ id: mockId, ...data }); // Return a resolved promise with the data including an 'id'
}

// Example function that would interact with your database
function deleteAppointmentFromDatabase(id) {
  // This would typically involve a database call like:
  // return Database.delete('appointments', id);
  return Promise.resolve(); // Mocked promise for demonstration
}

// Example function that would interact with your database
function updateAppointmentInDatabase(id, data) {
  // This would typically involve a database call like:
  // return Database.delete('appointments', id);
  return Promise.resolve({ id, ...data }); // Mocked promise for demonstration
}

// home page route handler
app.get('/api/message', (req, res) => {
  try {
    res.json({ message: 'Server is connected!' });
  } catch (error) {
    console.error('Failed to send message:', error);
    res.status(500).send('Internal Server Error');
  }
});


// get all appointments associated with an emal
app.get('/api/appts/:email', (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    // Retrieve appts from database
    res.status(200).json({
      message: 'Appts retrieved successfully',
      appts: [
        { id: 1, date: "2023-10-15", time: "10:00 AM"},
        { id: 2, date: "2023-10-20", time: "02:00 PM"}
      ] // fetch from database later
    });
  } catch (error) {
    console.error('Failed to find appointment:', error);
    res.status(500).send('Internal Server Error');
  }
});

// booking page handler
app.post('/api/appts', (req, res) => {
  const appointmentData = req.body; // Data sent from the client
  console.log(appointmentData);

  // Simulate database insertion and generate a mock ID
  createAppointmentInDatabase(appointmentData)
      .then(newAppointment => {
          res.status(201).json({
              message: 'Appointment created successfully',
              appointment: newAppointment
          });
      })
      .catch(error => {
          console.error('Failed to create appointment:', error);
          res.status(500).send('Internal Server Error');
      });
});

// reschedule page handler
// mock the response to a database update
app.put('/api/appts/:id', (req, res) => {
  const { id } = req.params;
  const appointmentData = req.body; // data sent from the client to update the appointment

  // Assuming you have a database method to update an appointment
  updateAppointmentInDatabase(id, appointmentData)
      .then(updatedAppointment => {
          res.json({
              message: 'Appointment updated successfully',
              updatedAppointment
          });
      })
      .catch(error => {
          console.error('Failed to update appointment:', error);
          res.status(500).send('Internal Server Error');
      });
});

// cancel handler
// mock the response to a database delete
app.delete('/api/appts/:id', (req, res) => {
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



// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
