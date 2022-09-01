const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    UserName:{
        type:String,
        required:true,
        trim:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Password: {
        type: String,
        required:true
    },
    avatar:{
        type:String,
        default:"https://www.pngitem.com/pimgs/m/294-2947257_interface-icons-user-avatar-profile-user-avatar-png.png"
    },
    Role:{
        type:String,
        required:true
    },
    discription:{
        type:String,
        maxlenght:200
    },
    followers:[{type:mongoose.Types.ObjectId,ref:'User'}],
    following:[{type:mongoose.Types.ObjectId,ref:'User'}],
    resetPasswordToken:String,
    resetPasswordExpire:Date
},
{
    timestamps:true
});

module.exports = mongoose.model('User',UserSchema);