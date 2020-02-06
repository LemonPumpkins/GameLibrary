var express = require("express");
var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var router = express.Router();

//load user model
require("../models/User");
var User = mongoose.model("user");


router.get('/login', function(req, res){
    res.render("users/login");
});
router.get('/register', function(req, res){
    res.render("users/register");
});
router.post('/register', function(req, res){
var errors = [];
if(req.body.password != req.body.password2){
    errors.push({text:"Passwords do not match"})
}
if(errors.length > 0){
    res.render('/register',{
        errors:errors,
        name:req.body.name,
        email:req.body.email
    })
}else{
    var newUser = new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    });

bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(new newUser.password, salt, function(err, hash){
        if(err)throw err;
        newUser.password = hash;
        newUser.save().then(function(user){
            res.redirect('/user/login');
    }).catch(function(err){
        console.log(err);
        return;
    });
});
    
    });
}
});
module.exports = router;
