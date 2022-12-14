const express = require('express');
const app = express.Router();
const User = require('../models/UserModel');
const mongoose = require("mongoose")
const {protect}= require("../authMiddleware")

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

            const user = await User.findOne({_id:req.params.id}).limit(10).select("-Password -Role");
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


app.post('/updateuser',protect,async(req,res)=>{
    try{
        //data check
        const {UserName,Email,avatar,discription} = req.body;

        if(!UserName || !Email || !avatar)
        {
            res.status(400).json({msg:"need data"});
            return;
        }
        
        if(UserName.toLowerCase().replace(/ /g,'').length<5 || UserName.toLowerCase().replace(/ /g,'').length>25)
        {
            res.status(400).json({msg:"username less than 5 characters or more than 25"});
            return;
        }
        if(discription){
            if(discription.toLowerCase().length>200)
            {
                res.status(400).json({msg:"discription more than 25 characters  "});
                return;
            }
        }

        if(!Email.toLowerCase().replace(/ /g,'')
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )){
            res.status(400).json({msg:"please enter right email"});
            return;
        }

       await User.findByIdAndUpdate(req.user._id,{
        UserName,Email,avatar,discription
       })

       res.status(200).json({msg:"done"});
    }
    catch(error)
    {
        console.log(error);
        //res.status(500).json({msg:error.message});
    }
})

app.post('/follow',protect,async(req,res)=>{
    try{
        //data check
        const {id} = req.body;

        if(!id)
        {
            res.status(400).json({msg:"need data"});
            return;
        }
        
        const user = await User.find({_id:id,followers:req.user._id});
        if(user.length>0) return res.status(500).json({msg:"You followed this user"})
    
        await User.findOneAndUpdate({_id:id},{$push:{followers:req.user._id}},{new:true});
        await User.findOneAndUpdate({_id:req.user._id},{$push:{following:id}},{new:true});
    
        res.status(200).json({msg:"done"});
    }
    catch(error)
    {
        console.log(error);
        //res.status(500).json({msg:error.message});
    }
})

app.post('/unfollow',protect,async(req,res)=>{
    try{
        //data check
        const {id} = req.body;

        if(!id)
        {
            res.status(400).json({msg:"need data"});
            return;
        }

        await User.findOneAndUpdate({_id:id},{$pull:{followers:req.user._id}},{new:true});
        await User.findOneAndUpdate({_id:req.user._id},{$pull:{following:id}},{new:true});
    
        res.status(200).json({msg:"done"});
    }
    catch(error)
    {
        console.log(error);
        //res.status(500).json({msg:error.message});
    }
})

app.post('/isfollowed',protect,async(req,res)=>{
    try{
        //data check
        const {id} = req.body;

        if(!id)
        {
            res.status(400).json({msg:"need data"});
            return;
        }
        
        const user = await User.find({_id:id,followers:req.user._id});
        if(user.length>0)  res.status(200).json({msg:"followed"})
        else { 
            res.status(400).json({msg:"not followed"});
        }
    
    }
    catch(error)
    {
        console.log(error);
        //res.status(500).json({msg:error.message});
    }
})

module.exports = app;