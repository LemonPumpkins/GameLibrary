var express = require("express");
var exphbs = require("express-handlebars");
var methodOverride = require("method-override");

var session = require('express-session');
var flash = require('connect-flash');
var bodyparser = require("body-parser");
var passport = require("passport");

var db = require('./helper/database');
var mongoose = require("mongoose");
var app = express();


//load routes
var games = require('./routes/games')
var users = require('./routes/users')

//load passport config
require('./config/passport')(passport);

//connect to mongoose
mongoose.connect("mongodb+srv://Lemon:Lemon@cluster0-zl3cf.mongodb.net/test?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology: true
}).then(function(){
    console.log("mongo db connected");
}).catch(function(err){
    console.log(err);
});


//require mehod override
app.use(methodOverride("_method"));

app.engine('handlebars', exphbs({defaultLayout:"main"}));
app.set('view engine', 'handlebars');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

//express session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))

app.use(passport.initialize());
app.use(passport.session());
//Flash and flash variables
app.use(flash());

app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error= req.flash('error');
    res.locals.user = req.user || null;
    next();

});

//get route using express handlebars
app.get("/", function(req, res){
    var title = "T. Hanks"
    res.render("index", {
        title:title
    });
});





app.get("/game/about", function(req, res){
    res.render("about");
});
app.get("/game/gameentry/gameentryadd", function(req, res){
    res.render("gameentry/gameentryadd");
});
app.put("/game/gameedit/:id", function(req, res){
    Game.findOne({
        _id:req.params.id
    }).then(function(game){
        game.title = req.body.title;
        game.price = req.body.price;
        game.description = req.body.description;

        game.save().then(function(game){
            req.flash('success_msg', "Game Edited");

            res.redirect("/game/games");
        })
    })
})
app.get("/game/gameentry/gameentryedit/:id", function(req, res){
    Game.findOne({
        _id:req.params.id
    }).then(function(games){
        res.render("gameentry/gameentryedit",{
            games:games
        });
    });    
});

//use new route
app.use('/game', games)
app.use('/users', users)


var port = process.env.PORT || 5000;


app.listen(port, function(){
    console.log("Game Library running on port 5000");
});