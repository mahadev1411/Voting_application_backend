const mongoose=require('mongoose');
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();
const mongoURL=process.env.mongo_URL;

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