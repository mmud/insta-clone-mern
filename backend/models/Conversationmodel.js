const mongoose = require('mongoose');

const ConversationSchema = mongoose.Schema({
    Content:{
        type:String,
        required:true
    },
    recipients:[{type:mongoose.Types.ObjectId,ref:'User'}]
},
{
    timestamps:true
});

module.exports = mongoose.model('Conversation',ConversationSchema);