const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    
},
{
    timestamps:true
});

module.exports = mongoose.model('Comment',CommentSchema);