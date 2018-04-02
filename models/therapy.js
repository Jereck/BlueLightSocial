var mongoose = require("mongoose");

var therapySchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    street1: String,
    street2: String,
    city: String,
    state: String,
    zip: String,
    website: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports =  mongoose.model("Therapy", therapySchema);