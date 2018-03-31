var mongoose = require('mongoose');

var statusSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        profile_picture: String
    }
});

module.exports = mongoose.model("Status", statusSchema);