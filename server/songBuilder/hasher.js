var crypto = require('crypto');
 
module.exports = {

  createHash : function(str) { //Hashids only accepts numbers for hashing, maybe we can use the mongo object id
    var shasum = crypto.createHash('sha1');
    shasum.update(str);
    return shasum.digest('hex').slice(0, 5);
  }

}