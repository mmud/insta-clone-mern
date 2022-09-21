const express = require('express');
const app = express.Router();
const User = require('../models/UserModel');
const Message = require('../models/MessageModel');
const Conversation = require('../models/Conversationmodel');
const mongoose = require("mongoose")
const {protect}= require("../authMiddleware")


app.post('/',protect,async(req,res)=>{
    try{
        //data check
        const {recipient,Content} = req.body;

        if(!recipient || !Content.trim())
        {
            res.status(400).json({msg:"need data"});
            return;
        }
        
        const newConbsersation = await Conversation.findOneAndUpdate({
            $or:[
                {recipients:[req.user._id,recipient]},
                {recipients:[recipient,req.user._id]}
            ]
        },{
            recipients:[req.user._id,recipient],
            Content
        },{new:true,upsert:true})

        const newMessage = await Message.create({
            Conversation:newConbsersation,
            sender:req.user._id,
            recipient,Content
        })

       res.status(200).json(newMessage);
    }
    catch(error)
    {
        console.log(error);
        //res.status(500).json({msg:error.message});
    }
})

app.get('/conversations',protect,async(req,res)=>{
    try{
        const condata = await Conversation.find({recipients:req.user._id})
        .sort("updatedAt").populate("recipients","avatar UserName")

       res.status(200).json(condata);
    }
    catch(error)
    {
        console.log(error);
        //res.status(500).json({msg:error.message});
    }
})

app.post('/messages',protect,async(req,res)=>{
    const {id} = req.body;
    if(!id)
    {
        res.status(400).json({msg:"need data"});
        return;
    }

    try{
        const condata = await Message.find({
            $or:[
                {sender:req.user._id,recipient:id},
                {sender:id,recipient:req.user._id}
            ]
        })
        .sort("-createdAt")

       res.status(200).json(condata);
    }
    catch(error)
    {
        console.log(error);
        //res.status(500).json({msg:error.message});
    }
})

module.exports = app;