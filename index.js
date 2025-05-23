const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable All CORS Requests
app.use(cors());

app.post("/log", (req, res) => {
  const message = req.body.message;
  
  if (message === undefined) {
    console.log("Received request with no message in body");
    return res.status(400).json({ success: false, message: "'message' field is missing in the request body" });
  }
  
  console.log("Received message:", message);
  res.status(200).json({ success: true, message: "Message logged successfully" });
});

app.get("/", (req, res) => {
  res.status(200).send("Logger service is running. POST to /log to send messages.");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
}); 