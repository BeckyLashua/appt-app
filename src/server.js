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

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
