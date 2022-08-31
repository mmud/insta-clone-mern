const express = require('express');
const app = express.Router();
const User = require('../models/UserModel');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {protect}= require("../authMiddleware")

//register new user
app.post('/register',async(req,res)=>{
    try{
        //data check
        const {UserName,Email,Password} = req.body;

        if(!UserName || !Email || !Password)
            res.status(400).send("need data");
        
        const userExists = await User.findOne({Email:Email});

        if(userExists)
            res.status(400).send("user already exist");

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(Password,salt);

        //create user
        const user = await User.create({
            UserName:UserName,
            Email:Email,
            Password:hashedpassword,
            Role:"user"
        })
        if(user)
        {
            res.status(201).json({
                id:user.id,
                name:user.UserName,
                email:user.Email,
                token:generateToken(user._id,user.Role)
            });
        }
        else
            res.status(400).send("invalid user data")
    }
    catch(error)
    {
        console.log(error);
    }
})

//login
app.post('/login',async(req,res)=>{
    try{
        //data check
        const {Email,Password} = req.body;

        if(!Email || !Password)
            res.status(400).send("need data");
        
        const user = await User.findOne({Email:Email});

        if(user &&(await bcrypt.compare(Password,user.Password)))
        {
            res.status(201).json({
                id:user.id,
                name:user.UserName,
                email:user.Email,
                token:generateToken(user._id,user.Role)
            });
        }
        else
            res.status(400).send("invalid email or password")
    }
    catch(error)
    {
        console.log(error);
    }
})

//get user data
app.get('/getme',protect,async(req,res)=>{
    try{
        const {_id,UserName,Email,Role}=await User.findById(req.user.id);
        res.status(200).json({
            _id:_id,
            UserName:UserName,
            Email:Email,
            Role:Role
        })
    }catch(error)
    {
        console.log(error);
    }
})

//generate forget token
app.post('/forgetpassword',async(req,res)=>{
    try{
        //data check
        const {Email} = req.body;

        if(!Email)
            res.status(400).send("need data");
        
        const user = await User.findOne({Email:Email});

        if(user)
        {
            const resetToken = await Math.random().toString(36).split('.')[1];
            const resetPasswordExpire = Date.now()+10*(60*1000);
            User.findOneAndUpdate({Email:Email},{resetPasswordToken:resetToken,resetPasswordExpire:resetPasswordExpire});
            const resetURL = 'http://'+process.env.HOST+`/passwordreset/${resetToken}`;
            const mailmessage=`
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password</p>
            <a href=${resetURL} clicktracking=off>${resetURL}</a>
            `;

            //email send
            res.status(200).send(resetToken);

        }
        else
            res.status(400).send("invalid email")
    }
    catch(error)
    {
        console.log(error);
    }
})

//check and reset
app.put('/resetpassword/:token',async(req,res)=>{
    try{
        const user=await User.findOne({
            resetPasswordToken:req.params.token,
            resetPasswordExpire:{$gt:Date.now()}
        });

        if(!user)
            res.status(400).send("Invalid reset token")
        
        if(req.body.Password==req.body.Password2){
            const salt = await bcrypt.genSalt(10);
            const hashedpassword = await bcrypt.hash(req.body.Password,salt);
            
            await User.findOneAndUpdate({Email:user.Email},{resetPasswordToken:null,resetPasswordExpire:null,Password:hashedpassword});
            res.status(200).send("done");
        }
        else
            res.status(400).send("passwords are not match")
    }catch(error)
    {
        console.log(error);
    }
})

app.get('/isloggedin',protect,(req,res)=>{
    res.status(200).send("logedin");
});

//jwt
const generateToken=(id,role)=>{
    return jwt.sign({id,role},process.env.JWT_SECRET,{
        expiresIn:"30d"
    })
}

module.exports = app;