const express = require('express');
const app = express.Router();
const User = require('../models/UserModel');
const mongoose = require("mongoose")

app.get('/searchbyname',async(req,res)=>{
    try {
        const users = await User.find({UserName:{ "$regex": req.query.UserName, "$options": "i" }})
        .limit(10).select("UserName avatar _id");
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
    }
})

app.get('/getuser/:id',async(req,res)=>{
    try {
        if(mongoose.Types.ObjectId.isValid(req.params.id)){

            const user = await User.findOne({_id:req.params.id}).select("-Password -Role");
            if(!user)
                res.status(404).json({msg:"Not Found"});

            res.status(200).json(user);
        }
        else{
            res.status(404).json({msg:"Not Found"});
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = app;