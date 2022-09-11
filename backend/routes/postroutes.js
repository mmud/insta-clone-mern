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

app.get('/',protect,async(req,res)=>{
    try {
        const posts = await Post.find({user:[...req.user.following, req.user._id]})
        .sort("-createdAt")
        .populate("user likes","avatar UserName _id")
        res.status(200).json({result:posts.length,posts});
    
    } catch (error) {
        console.log(error);
    }
})

app.post('/edit',protect,async(req,res)=>{
    try {
        const { Content,images,_id,userid } = req.body;

        if((!Content ||  Content.toLowerCase().replace(/ /g,'').length==0))
        {
            if( images==[]){
                res.status(400).json({msg:"need data"});
                return;
            }
        }

        if(userid!=req.user._id)
        {
            res.status(400).json({msg:"that not your post"})
            return
        }


        const post = await Post.findOneAndUpdate({_id},{
            Content,images
        });

        res.status(200).json({msg:"done"});
    
        } catch (error) {
        console.log(error);
    }
})

module.exports = app;