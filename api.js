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

var port = process.env.PORT || 7203;
var app = express();

app.use(bodyParser.json());

app.use('*', function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});

app.use('/',router);

router.route('/posts/:postid').get(function(req,res){
    console.log(req);
    Posts.findById(req.params.postid,function(err,post){
        if(err)
            res.status(500).send(err);
        else
            res.json(post);
    })
})

router.route('/posts/delete/:postid').delete(function(req,res){
    console.log("delete post");
    Posts.remove({_id: req.params.postid},function(err){
        if(err)
            res.status(500).send(err);
    });
})

router.route('/comments/delete/:cid').delete(function(req,res){
    Comment.remove({_id: req.params.cid},function(err){
        if(err)
            res.status(500).send(err);
    });
});


function createSendToken(user,res){
    var payload = {
        sub: user.id
    }
    var token = jwt.encode(payload,"casvensecretkey");
    res.status(200).send({user:user.toJSON(),token:token});
}

app.post('/postcomment',function(req,res){
    var ncomment = req.body;
    console.log(ncomment);
    var newcomment = new Comment({
        postid: ncomment.postid,
        commentcontent:ncomment.content,
        postedon:ncomment.postedon,
        author :ncomment.author
    });
    newcomment.save(function(err){
      res.status(200);
    })
})


app.post('/updatecomment',function(req,res){
    req.c = req.body;
    var searchUser = {_id: req.c._id};
    Comment.findOne(searchUser,function(err,c){
        if(err) throw err;
        console.log(c);
        c.commentcontent = req.c.commentcontent;
        c.save(function(err){
            res.status(200);
        })
    });
})


app.post('/updatepost',function(req,res){
    req.post = req.body;
    var searchUser = {_id: req.post._id};
    Posts.findOne(searchUser,function(err,post){
        if(err) throw err;

        post.content = req.post.content;



        post.save(function(err){
            res.status(200);
        })
    });


})

app.post('/updateprofile',function(req,res){
    req.user = req.body;
    console.log(req.user.userid);
    var searchUser = {_id: req.user.userid};
    User.findOne(searchUser,function(err,user){
        if(err) throw err;
        var nuser = req.body;

        user.email=nuser.email;
        user.username=nuser.username;

        user.save(function(err){
            createSendToken(user,res);
        })
    });


})

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
        res.status(200).send(newPost);
    })
})

app.get('/',function(req,res){
    res.status(200).send({message: " successfully "});
})

app.get('/posts',function(req,res){
    var profile = req.body;
    Posts.find({},{},{sort:{postedon:-1}},function(err,col){
        res.send(col);
    })

})

app.get('/comments',function(req,res){
    var profile = req.body;
    Comment.find({},{},{},function(err,col){
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


module.exports.getApp = app;