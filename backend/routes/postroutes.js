const express = require('express');
const app = express.Router();
const User = require('../models/UserModel');
const Post = require('../models/PostModel');
const mongoose = require("mongoose")
const {protect}= require("../authMiddleware")


app.post('/',protect,async(req,res)=>{
    try {
        const { Content,images } = req.body;

        if((!Content ||  Content.toLowerCase().replace(/ /g,'').length==0))
        {
            if( images==[]){
                res.status(400).json({msg:"need data"});
                return;
            }
        }
        const post = await Post.create({
            Content,images,user:req.user._id
        });

        res.status(200).json({msg:"done"});
    
        } catch (error) {
        console.log(error);
    }
})

module.exports = app;