const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    Content:{
        type:String,
        required:true
    },
    likes:[{type:mongoose.Types.ObjectId,ref:'User'}],
    user:{type:mongoose.Types.ObjectId,ref:'User'},
    postid:mongoose.Types.ObjectId,
},
{
    timestamps:true
});

module.exports = mongoose.model('Comment',CommentSchema);