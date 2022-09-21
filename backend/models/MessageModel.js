const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    Content:{
        type:String,
        required:true
    },
    Conversation:{type:mongoose.Types.ObjectId,ref:'User'},
    recipient:{type:mongoose.Types.ObjectId,ref:'User'},
    sender:{type:mongoose.Types.ObjectId,ref:'User'}

},
{
    timestamps:true
});

module.exports = mongoose.model('Message',MessageSchema);