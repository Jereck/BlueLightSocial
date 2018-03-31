var express = require("express");
var passport = require("passport");
var router = express.Router();
var User = require("../models/user");
var Status = require("../models/status");

router.get("/profile", function(req, res){
    Status.find({}, function(err, allPosts){
        if(err){
            console.log(err);
        } else {
            res.render("profile", {posts: allPosts, currentUser: req.user});
        }
    });
});

router.post("/status", function(req, res){
    Status.create(req.body, function(err, post){
        if(err){
            console.log(err);
        } else {
            post.author.id = req.user._id;
            post.author.username = req.user.username;
            post.author.profile_picture = req.user.profile_picture;
            post.text = req.body.status;
            post.save()
            console.log(post);
            res.redirect("back");
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

module.exports = router;