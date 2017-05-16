var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tokenSchema = Schema({
  token: String,
  app: { type: Schema.Types.ObjectId, ref: 'App' },
  appId: Number,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Token', tokenSchema);
