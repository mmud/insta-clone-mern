const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    Content:{
        type:String,
        required:true
    },
    reply:mongoose.Types.ObjectId,
    likes:[{type:mongoose.Types.ObjectId,ref:'User'}],
    user:{type:mongoose.Types.ObjectId,ref:'User'}
},
{
    timestamps:true
});

module.exports = mongoose.model('Comment',CommentSchema);