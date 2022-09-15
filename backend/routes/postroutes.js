const express = require('express');
const app = express.Router();
const User = require('../models/UserModel');
const Post = require('../models/PostModel');
const Comment = require('../models/CommentModel');
const mongoose = require("mongoose")
const {protect}= require("../authMiddleware");
const { findOne } = require('../models/UserModel');


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
        .populate({path:"comments",populate:{path:"user"}})
        res.status(200).json({result:posts.length,posts});
    
    } catch (error) {
        console.log(error);
    }
})

app.post('/edit',protect,async(req,res)=>{
    try {
        const { Content,images,_id,userid } = req.body;

        const p= await Post.findOne({_id}); 

        if((!Content ||  Content.toLowerCase().replace(/ /g,'').length==0))
        {
            if( images==[]){
                res.status(400).json({msg:"need data"});
                return;
            }
        }

        if(req.user._id.toString()!==p.user.toString())
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

app.post('/like',protect,async(req,res)=>{
    try {
        const { _id } = req.body;

        const post = await Post.find({_id,likes:req.user._id})
        
        if(post.length>0)
        {
            res.status(400).json({msg:"you liked this post"})
        }

        await Post.findOneAndUpdate({_id},{
            $push:{likes:req.user._id}
        },{new:true});

        res.status(200).json({msg:"done"});
    
        } catch (error) {
        console.log(error);
    }
})

app.post('/unlike',protect,async(req,res)=>{
    try {
        const { _id } = req.body;

        const post = await Post.find({_id,likes:req.user._id})
        
        if(post.length<=0)
        {
            res.status(400).json({msg:"you unliked this post"})
        }

        await Post.findOneAndUpdate({_id},{
            $pull:{likes:req.user._id}
        },{new:true});

        res.status(200).json({msg:"done"});
    
        } catch (error) {
        console.log(error);
    }
})

app.post('/comment',protect,async(req,res)=>{
    try {
        const { Content,postId } = req.body;

        if((!Content ||  Content.toLowerCase().replace(/ /g,'').length==0))
        {
           
            res.status(400).json({msg:"need data"});
            return;
            
        }
        const newcomment = await Comment.create({
            Content,user:req.user._id,postid:postId
        });

        await Post.findOneAndUpdate({_id:postId},{
            $push:{comments:newcomment._id}
        },{new:true})

        res.status(200).json({msg:"done"});
    
        } catch (error) {
        console.log(error);
    }
})

app.post('/editcomment',protect,async(req,res)=>{
    try {
        const { Content,_id } = req.body;

        const p= await Comment.findOne({_id}); 

        if((!Content ||  Content.toLowerCase().replace(/ /g,'').length==0))
        {
            res.status(400).json({msg:"need data"})
            return;
        }

        if(req.user._id.toString()!=p.user.toString())
        {
            res.status(400).json({msg:"that not your comment"})
            return
        }


        const post = await Comment.findOneAndUpdate({_id},{
            Content
        });

        res.status(200).json({msg:"done"});
    
        } catch (error) {
        console.log(error);
    }
})

app.post('/likecomment',protect,async(req,res)=>{
    try {
        const { _id } = req.body;

        const com = await Comment.find({_id,likes:req.user._id})
        
        if(com.length>0)
        {
            res.status(400).json({msg:"you liked this comment"})
        }

        await Comment.findOneAndUpdate({_id},{
            $push:{likes:req.user._id}
        },{new:true});

        res.status(200).json({msg:"done"});
    
        } catch (error) {
        console.log(error);
    }
})

app.post('/unlikecomment',protect,async(req,res)=>{
    try {
        const { _id } = req.body;

        const com = await Comment.find({_id,likes:req.user._id})
        
        if(com.length<=0)
        {
            res.status(400).json({msg:"you unliked this comment"})
        }

        await Comment.findOneAndUpdate({_id},{
            $pull:{likes:req.user._id}
        },{new:true});

        res.status(200).json({msg:"done"});
    
        } catch (error) {
        console.log(error);
    }
})

app.post('/deletecomment',protect,async(req,res)=>{
    try {
        const { _id } = req.body;

        const p= await Comment.findOne({_id}); 

        if(req.user._id.toString()!=p.user.toString())
        {
            res.status(400).json({msg:"that not your comment"})
            return
        }

        const post = await Post.findOneAndUpdate({_id:p.postid},{
            $pull:{comments:_id}
        });
        
        await Comment.findOneAndDelete({_id});


        res.status(200).json({msg:"done"});
    
        } catch (error) {
        console.log(error);
    }
})

module.exports = app;