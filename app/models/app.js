var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var appSchema = Schema({
  publicId: Number,
  apiKey: String,
  name: String,
  developer: { type: Schema.Types.ObjectId, ref: 'User' },
  type: Number
});

appSchema.plugin(autoIncrement.plugin, { model: 'App', field: 'publicId', startAt: 1 });

module.exports = mongoose.model('App', appSchema);
