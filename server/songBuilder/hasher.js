var crypto = require('crypto');
var songCtrl = require('../controllers/songController');
 
module.exports = {

  createHash : function(str, callback) { //Hashids only accepts numbers for hashing, maybe we can use the mongo object id
    var shasum = crypto.createHash('sha1');
    shasum.update(str);
    var url_hash = shasum.digest('hex').slice(0, 5);

    songCtrl.get({hash_id: url_hash}, function (err, response) {
      if (err) console.error(err);

      if (response === null) {
        callback(url_hash);
      } else {
        module.exports.createHash(str+'new', callback);
      }
    })

  }

}