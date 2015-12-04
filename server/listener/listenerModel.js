var mongoose = require('mongoose');

var ListenerSchema = new mongoose.Schema({
  title : String,
  artist : String,
  albumart: String,
  providers: [{}]
});

module.exports = mongoose.model('Listener', ListenerSchema);