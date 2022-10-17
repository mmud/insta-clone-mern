const express = require('express');
const app = express.Router();
const User = require('../models/UserModel');
const Reel = require('../models/ReelModel');
const Conversation = require('../models/Conversationmodel');
const mongoose = require("mongoose")
const {protect}= require("../authMiddleware")

app.post('/',protect,async(req,res)=>{
    try {
        const { Content,VideoURL } = req.body;

        if((!VideoURL ||  VideoURL.toLowerCase().replace(/ /g,'').length==0))
        {
            res.status(400).json({msg:"need data"});
        }
        const reel = await Reel.create({
            Content,VideoURL,user:req.user._id
        });

        res.status(200).json({Reel:reel});
    
        } catch (error) {
        console.log(error);
    }
})

app.get('/',protect,async(req,res)=>{
    try {
        let num = req.query.num;

        const posts = await Reel.find({user:[...req.user.following, req.user._id]})
        .sort("-createdAt").skip((num-1)*5).limit(5)
        .populate("user likes","avatar UserName _id")
        .populate({path:"comments",populate:{path:"user"}})
        res.status(200).json({result:posts.length,posts});
    
    } catch (error) {
        console.log(error);
    }
})

app.get('/getuserreels/:id',protect,async(req,res)=>{
    try {
        const posts = await Reel.find({user:req.params.id})
        .sort("-createdAt")
        .populate("user likes","avatar UserName _id")
        .populate({path:"comments",populate:{path:"user"}})
        res.status(200).json({result:posts.length,posts});
    
    } catch (error) {
        console.log(error);
    }
})

app.get('/reel/:id',protect,async(req,res)=>{
    try {
        const post = await Reel.findOne({_id:req.params.id})
        .populate("user likes","avatar UserName _id")
        .populate({path:"comments",populate:{path:"user",select:"-Password"}})
        res.status(200).json({result:post.length,post});
    
    } catch (error) {
        console.log(error);
    }
})

module.exports = app;