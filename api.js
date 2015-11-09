/**
 * Created by knandula on 11/6/2015.
 */
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/User.js');
var Posts = require('./models/Posts.js');
var jwt = require('./services/jwt.js');

var port = process.env.PORT || 7203;
var app = express();

app.use(bodyParser.json());

app.use('*', function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});





function createSendToken(user,res){
    var payload = {
        sub: user.id
    }
    var token = jwt.encode(payload,"casvensecretkey");
    res.status(200).send({user:user.toJSON(),token:token});
}


app.post('/register',function(req,res){
    req.user = req.body;
    var searchUser = {email: req.user.email};
    User.findOne(searchUser,function(err,user){
        if(err) throw err;
        if(user)  return res.status(401).send({message: " email already exists "});

        var user = req.body;
        var newUser = new User({
            email: user.email,
            password: user.password,
            username: user.username
        })
        newUser.save(function(err){
            createSendToken(newUser,res);
        })
    });


})


app.post('/login',function(req,res){
    req.user = req.body;
    var searchUser = {email: req.user.email};
    console.log(searchUser);
    User.findOne(searchUser,function(err,user){
        if(err) throw err;
        if(!user)  return res.status(401).send({message: "  Wrong email/password  "});
        user.comparePassword(req.user.password,function(err,isMatch){
            if(err) throw err;
            if(!isMatch) return res.status(401).send({message: "  Wrong email/password  "});
            if(isMatch) createSendToken(user,res);
        });
    })
})


app.post('/posts',function(req,res){
    var post = req.body;
    console.log(post.username);

    var newPost = new Posts({
        content: post.content,
        userid: post.id,
        postedon: post.timestamp,
        author: post.username
    })
    newPost.save(function(err){
        res.status(200);
    })
})

app.get('/posts',function(req,res){
    var profile = req.body;


    Posts.find({},{},{sort:{postedon:-1}},function(err,col){

        res.send(col);
    })

})



function verify(raw,secret,signature){
    return signature === sign(raw,secret);
}

mongoose.connect('mongodb://superhero:superhero@ds033429.mongolab.com:33429/startupone');

var server = app.listen(port,function(){
    console.log('api listening on',port);
})