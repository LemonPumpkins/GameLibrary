var express = require("express");

var mongoose = require("mongoose");
var router = express.Router();


//load game model
require("../models/Game");
var Game = mongoose.model("games");


router.get("/games", function(req, res){
    Game.find({}).then(function(games){
        console.log(games);
        res.render("gameentry/index", {
            games:games
        });
    });
    
});

//post request
router.post("/gameentry", function(req, res){
    console.log(req.body);
    var errors = [];

    if(!req.body.title){
        errors.push({text:"please add a title, fool"})
    }
    if(!req.body.price){
        errors.push({text:"please add a price, fool"})
    }
    if(!req.body.description){
        errors.push({text:"please add a description, fool"})
    }
    if(errors.length > 0){
        res.render("gameentry/gameentryadd",{
            errors:errors,
            title:req.body.title,
            price:req.body.price,
            description:req.body.description
        });
    }else{
        //res.send(req.body);
        var newUser = {
            title:req.body.title,
            price:req.body.price,
            description:req.body.description
        }
        Game(newUser).save().then(function(games){
            console.log(games);
            req.flash('success_msg', "Game Posted");
            res.redirect("/games");
        });
    }
    //
});

router.delete('/gamedelete/:id',function(req,res){
    Game.deleteOne({
        _id:req.params.id
    }).then(function(){
        req.flash('success_msg', "Game Deleted");

        res.redirect('/games');
    })
})

module.exports = router;
