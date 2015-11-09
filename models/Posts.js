/**
 * Created by knandula on 11/6/2015.
 */

var mongoose = require('mongoose');


var PostsSchema = new mongoose.Schema({
    content:String,
    password:String,
    postedon:[Date],
    author :String
})


module.exports = mongoose.model('Posts',PostsSchema)