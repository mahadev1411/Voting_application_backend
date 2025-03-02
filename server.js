const express = require("express");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const userRoutes = require("./userRoutes"); // Ensure correct path
const candidateRoutes = require("./candidateRoute"); // Ensure correct path
const db = require('./db')

const app = express();
const PORT = process.env.PORT;

// Middleware to parse JSON payloads
app.use(express.json());

app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
