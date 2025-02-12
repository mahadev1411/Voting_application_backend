const mongoose=require('mongoose');
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();
const mongoURL="mongodb://localhost:27017/"

mongoose.connect(mongoURL)

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