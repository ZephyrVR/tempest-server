var mongoose = require('mongoose');

var appSchema = mongoose.Schema({
    publicId: Number,
    apiKey: String,
    name: String,
    developer: String,
    type: Number
});

module.exports = mongoose.model('App', appSchema);