const mongoose = require('mongoose');

const ReelSchema = mongoose.Schema({
    Content:{
        type:String
    },
    VideoURL:{
        type:String
    },
    likes:[{type:mongoose.Types.ObjectId,ref:"User"}],
    comments:[{type:mongoose.Types.ObjectId,ref:"Comment"}],
    user:{type:mongoose.Types.ObjectId,ref:"User"}
},
{
    timestamps:true
});

module.exports = mongoose.model('Reel',ReelSchema);