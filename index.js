const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable All CORS Requests
app.use(cors());

let clients = [];
let logHistory = []; // In-memory store for logs

// Endpoint for Server-Sent Events
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // flush the headers to establish the connection

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  clients.push(newClient);
  console.log(`${clientId} Connection opened`);

  // Send an initial connection confirmation message
  res.write(`data: ${JSON.stringify({ type: 'connection_established', message: "SSE Connection Established" })}\n\n`);
  
  // Send all existing logs to the new client
  logHistory.forEach(log => {
    res.write(`data: ${JSON.stringify(log)}\n\n`);
  });

  req.on('close', () => {
    clients = clients.filter(client => client.id !== clientId);
    console.log(`${clientId} Connection closed`);
  });
});

// Function to send message to all connected clients
function sendEventToAllClients(eventData) {
  clients.forEach(client => client.res.write(`data: ${JSON.stringify(eventData)}\n\n`));
}

app.post("/log", (req, res) => {
  const message = req.body.message;
  
  if (message === undefined) {
    console.log("Received request with no message in body");
    return res.status(400).json({ success: false, message: "'message' field is missing in the request body" });
  }
  
  console.log("Received message:", message);
  
  const newLogEntry = { 
    type: 'new_log', 
    content: message, 
    timestamp: new Date().toISOString() 
  };
  
  logHistory.push(newLogEntry); // Store the log
  sendEventToAllClients(newLogEntry); // Send to all connected SSE clients
  
  res.status(200).json({ success: true, message: "Message logged successfully" });
});

// New endpoint to clear logs
app.delete("/logs", (req, res) => {
  logHistory = []; // Clear the in-memory log store
  console.log("All logs cleared.");
  sendEventToAllClients({ type: 'logs_cleared', message: "All logs have been cleared." });
  res.status(200).json({ success: true, message: "Logs cleared successfully" });
});

app.get("/", (req, res) => {
  res.status(200).send("Logger service is running. POST to /log to send messages. Visit /index.html to see live logs.");
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server listening on port ${port}. Visit http://localhost:${port}/index.html to see live logs.`);
}); 