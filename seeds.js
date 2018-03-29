var mongoose = require("mongoose");
var Therapy = require("./models/therapy");
var Comment = require("./models/comment");

var data = [
    {
        name: "Perspectives",
        image: "https://bulma.io/images/placeholders/640x480.png",
        description: "This is a description of the company, blah blah blah",
        city: "Kirkland",
        state: "Washington",
        zip: "98033"
    },
    {
        name: "Connections",
        image: "https://bulma.io/images/placeholders/640x480.png",
        description: "This is a description of the company, blah blah blah",
        city: "Kirkland",
        state: "Washington",
        zip: "98033"
    },
    {
        name: "A.P.P.L.E.",
        image: "https://bulma.io/images/placeholders/640x480.png",
        description: "This is a description of the company, blah blah blah",
        city: "Kirkland",
        state: "Washington",
        zip: "98033"
    },
    {
        name: "Washington ABA",
        image: "https://bulma.io/images/placeholders/640x480.png",
        description: "This is a description of the company, blah blah blah",
        city: "Kirkland",
        state: "Washington",
        zip: "98033"
    },
]

function seedDB(){
    Therapy.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed Therapies");
        Comment.remove({}, function(err){
            if(err){
                console.log(err);
            }
            console.log("Removed comments!");

            data.forEach(function(seed){
                Therapy.create(seed, function(err, therapy){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Added therapy");

                        Comment.create(
                            {
                                text: "This is a great comment!",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    therapy.comments.push(comment);
                                    therapy.save();
                                    console.log("Created new comment!");
                                }
                            }
                        )
                    }
                })
            })
        })
    })
}


module.exports = seedDB;