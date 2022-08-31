const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    UserName:{
        type:String,
        required:true
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
    Powers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Power"
    }],
    Role:{
        type:String,
        required:true
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
},
{
    timestamps:true
});

module.exports = mongoose.model('User',UserSchema);