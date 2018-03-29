var express = require("express");
var passport = require("passport");
var router = express.Router();
var User = require("../models/user");

/////////////////
// HOME PAGE ////
/////////////////
router.get("/", function(req, res){
    res.render("index");
});


/////////////////
// AUTH ROUTES //
/////////////////
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User(
        {
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            profile_picture: req.body.profile_picture
        });
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/therapies");
        });
    });
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post('/login',
    passport.authenticate('local', { successRedirect: '/profile',
                                   failureRedirect: '/register' }));

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

module.exports = router;