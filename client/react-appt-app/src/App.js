import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/message');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('There was an error:', error);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div className="App">
      <h1>Message from the server:</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
