var mongoose = require('mongoose');

var tokenSchema = mongoose.Schema({
    token: String,
    app: String,
    appId: Number,
    user: String
});

module.exports = mongoose.model('Token', tokenSchema);