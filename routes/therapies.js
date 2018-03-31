var express = require("express");
var router = express.Router();
var Therapy = require("../models/therapy");
var Comment = require("../models/comment");
var User = require("../models/user");

////////////////////
// THERAPIES PAGE //
////////////////////
router.get("/therapies", function(req, res){
    // Gather Therapies for DB
    Therapy.find({}, function(err, allTherapies){
        if(err){
            console.log(err);
        } else {
            res.render("therapies", {therapies: allTherapies, currentUser: req.user});
        }
    });
});

router.post("/therapies", function(req, res){
    var name = req.body.name
    var image = req.body.image
    var description = req.body.description
    var city = req.body.city
    var state = req.body.state
    var zip = req.body.zip
    var website = req.body.website
    var author = {
        id: req.user._id,
        username: req.user.username
    }

    var newTherapy = {
        name: name, 
        image: image, 
        description: description,
        city: city,
        state: state,
        zip: zip,
        website: website,
        author: author
    }

    // Create new Therapy and save to DB
    Therapy.create(newTherapy, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/therapies");
        }
    });
});

router.get("/therapies/new", function(req, res){
    res.render("new-therapy", {currentUser: req.user});
});

router.get("/therapies/:id", function(req, res){
    Therapy.findById(req.params.id).populate("comments").exec(function(err, foundTherapy){
        if(err){
            console.log(err);
        } else {
            res.render("show-therapy", {therapy: foundTherapy});
        }
    });
});

router.post("/therapies/:id/comments", isLoggedIn, function(req, res){
    Therapy.findById(req.params.id, function(err, therapy){
        if(err){
            console.log(err);
            res.redirect("/therapies");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.author.profile_picture = req.user.profile_picture;
                    //save comment
                    comment.save()
                    therapy.comments.push(comment);
                    therapy.save();
                    console.log(comment.author)
                    res.redirect("back");
                }
            });
        }
    });
});

// EDIT
router.get("/therapies/:id/edit", checkOwnership, function(req, res){
    Therapy.findById(req.params.id, function(err, foundTherapy){
        res.render("edit-therapy", {therapy: foundTherapy});
    });
});

// UPDATE
router.put("/therapies/:id", function(req, res){
    Therapy.findByIdAndUpdate(req.params.id, req.body.therapy, function(err, updatedTherapy){
        if(err){
            res.redirect("/therapies");
        } else {
            res.redirect("/therapies/" + req.params.id);
        }
    })
});
// DESTROY
router.delete("/therapies/:id", function(req, res){
    Therapy.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/therapies");
        } else {
            res.redirect("/therapies");            
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

function checkOwnership(req, res, next){
    if(req.isAuthenticated()){
        Therapy.findById(req.params.id, function(err, foundTherapy){
            if(err){
                res.redirect("back");
            } else {
                if(foundTherapy.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;