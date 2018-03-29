var express = require("express");
var passport = require("passport");
var router = express.Router();
var User = require("../models/user");

router.get("/profile", function(req, res){
    res.render("profile", {currentUser: req.user});
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

module.exports = router;