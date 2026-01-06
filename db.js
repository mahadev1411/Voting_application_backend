const mongoose = require("mongoose");

const mongoURL = process.env.Mongo_URL;

mongoose
  .connect(mongoURL, {
    serverSelectionTimeoutMS: 5000,
    family: 4, // force IPv4
  })
  .then(() => console.log("connected to database"))
  .catch((err) => console.log("database connection error:", err));

mongoose.connection.on("disconnected", () => {
  console.log("disconnected from database");
});

module.exports = mongoose.connection;
