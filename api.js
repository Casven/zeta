/**
 * Created by knandula on 11/6/2015.
 */
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/User.js');
var Posts = require('./models/Posts.js');
var Comment = require('./models/Comments.js');
var jwt = require('./services/jwt.js');


var router = express.Router();

var port = process.env.PORT || 8080;
var app = express();

app.use(bodyParser.json());

app.set('views','views');
app.set('view engine','jade');

app.use('/',router);


app.get('/',function(req,res){
    res.render('home',{

    });
})

var server = app.listen(port,function(){
    console.log('api listening on',port);
})


module.exports.getApp = app;