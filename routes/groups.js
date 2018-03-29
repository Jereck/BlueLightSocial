var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Group = require("../models/group");
var Comment = require("../models/comment");


router.get("/groups", function(req, res){
    Group.find({}, function(err, allGroups){
        if(err){
            console.log(err);
        } else {
            res.render("groups", {groups: allGroups, currentUser: req.user});
        }
    });
});

router.get("/groups/new", function(req, res){
    res.render("new-group", {currentUser: req.user});
});

router.post("/groups", function(req, res){
    var name = req.body.name
    var image = req.body.image
    var description = req.body.description

    var newGroup = {
        name: name,
        image: image,
        description: description
    }

    Group.create(newGroup, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/groups");
        }
    });
});

router.get("/groups/:id", function(req, res){
    Group.findById(req.params.id).populate("comments").exec(function(err, foundGroup){
        if(err){
            console.log(err);
        } else  {
            res.render("show-group", {group: foundGroup});
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