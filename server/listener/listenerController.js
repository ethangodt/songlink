
var Listener = require('./listenerModel.js');
var Mustache = require('mustache');
var fs = require('fs');
var path = require('path');


module.exports = {

  render : function (req, res, next) {

    var template = fs.readFileSync(path.join(__dirname, '../mustache/template.html'),'utf-8', function(err, data) {
      if (err) console.log(err);
    }); 

    var person = {
        firstName: "Kurtis",
        lastName: "W",
        blogURL: "info"
    };
    var person2 = {
        firstName: "Ethan",
        lastName: "GODT",
        blogURL: "test 2"
    };
    var person3 = {
        firstName: "nikolai",
        lastName: "stobie",
        blogURL: "more info"
    };

    var html = Mustache.render(template, person);
    var html2 = Mustache.render(template, person2);
    var html3 = Mustache.render(template, person3);

    if (req.url === '/test1') {
      res.send(html);
    } else if (req.url === '/test2') {
      res.send(html2);
    } else if (req.url === '/test3') {
      res.send(html3);
    }
  }
  
}

