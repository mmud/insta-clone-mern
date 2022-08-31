const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const {protect}= require("./authMiddleware")
const cors = require("cors");

//server
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.listen(process.env.PORT,()=>{console.log('server is running');})
app.use(cors({
    origin: 'http://localhost:3000'
}));

//mongodb
const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
}
connectDB();

//routes
app.use("/api/auth", require("./routes/authroutes"));