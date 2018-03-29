var mongoose = require("mongoose");

var therapySchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    city: String,
    state: String,
    zip: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports =  mongoose.model("Therapy", therapySchema);