var express = require("express");
var router = express.Router();
var Therapy = require("../models/therapy");
var Comment = require("../models/comment");

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

    var newTherapy = {
        name: name, 
        image: image, 
        description: description,
        city: city,
        state: state,
        zip: zip
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
                    therapy.comments.push(comment);
                    therapy.save();
                    res.redirect("back");
                }
            });
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