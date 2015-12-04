var mongoose = require('mongoose');

var ListenerSchema = new mongoose.Schema({
  artist : String,
  title : String
});

module.exports = mongoose.model('Listener', ListenerSchema);