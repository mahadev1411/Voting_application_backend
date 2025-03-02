const mongoose=require('mongoose');
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();
const mongoURL=process.env.Mongo_URL;

mongoose.connect(mongoURL, {
    ssl: true, // Use SSL/TLS
    tlsAllowInvalidCertificates: true, // Allow invalid TLS certs
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    socketTimeoutMS: 45000 // 45s socket timeout
})



const db=mongoose.connection;

db.on('connected',()=>{
    console.log("connected to database");
})

db.on('disconnected',()=>{
    console.log("disconnected from database");
})

db.on('error',()=>{
    console.log("database connection error");
})

module.exports=db;