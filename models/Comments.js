/**
 * Created by knandula on 11/9/2015.
 */

var mongoose = require('mongoose');


var CommentSchema = new mongoose.Schema({
    postid: String,
    commentcontent:String,
    postedon:[Date],
    author :String
})


module.exports = mongoose.model('Comments',CommentSchema)
