const express = require('express');
const app = express();

const hostname = '127.0.0.1';
const port = 3001;

const cors = require('cors');
app.use(cors());

// home page route handler
app.get('/api/message', (req, res) => {
  try {
    res.json({ message: 'Server is connected!' });
  } catch (error) {
    console.error('Failed to send message:', error);
    res.status(500).send('Internal Server Error');
  }
});


// search/appointments page handler 
// mock a response to a database read
app.get('/api/search', (req, res) => {
  try {
    res.json({ message: '[appt data array]!' });
  } catch (error) {
    console.error('Failed to send message:', error);
    res.status(500).send('Internal Server Error');
  }
});

// booking page handler
// mock response to a database create

// reschedule page handler
// mock the response to a database update

// cancel handler
// mock the response to a database delete

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
