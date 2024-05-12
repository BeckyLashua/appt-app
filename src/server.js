const express = require('express');
const app = express();

const hostname = '127.0.0.1';
const port = 3001;

// Define a route handler for the default home page
app.get('/', (req, res) => {
  res.send('Hello World\n');
});

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
