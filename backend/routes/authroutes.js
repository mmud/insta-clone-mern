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
        const {UserName,Email,Password1,Password2} = req.body;

        if(!UserName || !Email || !Password1 || !Password2)
        {
            res.status(400).json({msg:"need data"});
            return;
        }
        
        if(UserName.toLowerCase().replace(/ /g,'').length<5|| UserName.toLowerCase().replace(/ /g,'').length>25)
        {
            res.status(400).json({msg:"username less than 5 characters or more than 25"});
            return;
        }

        if(!Email.toLowerCase().replace(/ /g,'')
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )){
            res.status(400).json({msg:"please enter right email"});
            return;
        }

        if(!Password1.replace(/ /g,'').match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{4,}$/) )
            {
            res.status(400).json({msg:"Password should contains uppercase , numbers amd should be more than 4 characters "});
            return;
            }


        if(Password1.replace(/ /g,'') != Password2.replace(/ /g,''))
        {    
        res.status(400).json({msg:"the passwords are not equal"});
        return
        }

        const userExists = await User.findOne({Email:Email.toLowerCase().replace(/ /g,'')});

        if(userExists)
        {
            res.status(400).json({msg:"email already used"});
        return;
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(Password1.replace(/ /g,''),salt);

        //create user
        const user = await User.create({
            UserName:UserName.toLowerCase().replace(/ /g,''),
            Email:Email.replace(/ /g,''),
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
            res.status(500).json({msg:"invalid user data"})
    }
    catch(error)
    {
        console.log(error);
        //res.status(500).json({msg:error.message});
    }
})

//login
app.post('/login',async(req,res)=>{
    try{
        //data check
        const {Email,Password} = req.body;

        if(!Email || !Password)
            res.status(400).json({msg:"need data"});
        
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
            res.status(400).json({msg:"invalid email or password"});
    }
    catch(error)
    {
        console.log(error);
        //res.status(500).json({msg:error.message});

    }
})

//get user data
app.get('/getme',protect,async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select("-Password -Role");
        res.status(200).json(user)
    }catch(error)
    {
        console.log(error);
        //res.status(500).json({msg:error.message});

    }
})

//get user data
app.get('/avatar',protect,async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select("avatar");
        res.status(200).json(user)
    }catch(error)
    {
        console.log(error);
        //res.status(500).json({msg:error.message});

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
        //res.status(500).json({msg:error.message});

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
        //res.status(500).json({msg:error.message});

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