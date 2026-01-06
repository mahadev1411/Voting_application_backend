const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const userRoutes = require("./userRoutes");
const candidateRoutes = require("./candidateRoute");
require("./db"); // just require, no need to store in variable

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());          // ✅ AFTER app is created
app.use(express.json()); // parse JSON

// Routes
app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
