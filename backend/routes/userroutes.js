const express = require('express');
const app = express.Router();
const User = require('../models/UserModel');

app.get('/searchbyname',async(req,res)=>{
    try {
        const users = await User.find({UserName:{ "$regex": req.query.UserName, "$options": "i" }})
        .limit(10).select("UserName avatar _id");
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
    }
})

module.exports = app;