const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const {protect}= require("./authMiddleware");
const cors = require("cors");

//server
const app=express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended:false}));
app.use(cors({
    origin: 'http://localhost:3000'
}));

// socket
const http = require('http').createServer(app);
const io = require("socket.io")(http,{
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

let users=[];
io.on('connection', socket => {
    //connrect and disconnect
    socket.on('joinUser',id=>{
        users.push({id,socketId:socket.id});
        console.log(users)
    })

    socket.on("addMessage",msg=>{
        console.log(msg)
        const user = users.find(user=>user.id === msg.recipient);
        user && socket.to(`${user.socketId}`).emit("addMessageClient",msg);
    })

    socket.on("deleteMessage",msg=>{
        console.log(msg)
        const user = users.find(user=>user.id === msg.recipient);
        user && socket.to(`${user.socketId}`).emit("deleteMessageClient",msg);
    })

    socket.on("disconnect",id=>{
        if(users.length>0)
            users = users.filter(user=>user.socketId != socket.id);
        console.log(users)
    
        })
});
  

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
app.use("/api/user", require("./routes/userroutes"));
app.use("/api/post", require("./routes/postroutes"));
app.use("/api/message", require("./routes/messageroutes"));

//frontend
app.use(express.static('build'))
app.get('*',(req,res)=>{
    res.sendFile(`${__dirname}/build/index.html`);
})

http.listen(process.env.PORT,()=>{console.log('server is running');})
