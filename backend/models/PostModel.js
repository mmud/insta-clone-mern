const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    Content:{
        type:String
    },
    images:{
        type:Array,
        default:[]
    },
    likes:[{type:mongoose.Types.ObjectId,ref:"User"}],
    comments:[{type:mongoose.Types.ObjectId,ref:"Comment"}],
    user:{type:mongoose.Types.ObjectId,ref:"User"}
},
{
    timestamps:true
});

module.exports = mongoose.model('Post',PostSchema);