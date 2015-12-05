var Hashids = require("hashids"),
var hashids = new Hashids("songlink"); //salt
 
module.exports = {

  createHash : function(num) { //Hashids only accepts numbers for hashing, maybe we can use the mongo object id
    var id = hashids.encode(num);
    return id;
  }

}