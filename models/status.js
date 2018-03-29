var mongoose = require('mongoose');

var statusSchema = mongoose.Schema({
    text: String,
    author: String
});

module.exports = mongoose.model("Status", statusSchema);