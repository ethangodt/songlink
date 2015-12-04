
var Listener = require('./listenerModel.js');
var Mustache = require('mustache');
var fs = require('fs');
var path = require('path');

// notes for saving mixed data in mongo (for providers parameter on listenermodel)
// person.anything = { x: [3, 4, { y: "changed" }] };
// person.markModified('anything');
// person.save(); // anything will now get saved

module.exports = {

  render : function (req, res, next) {

    console.log('test1')
    Listener.create({
      title: 'I want it that way',
      artist: 'Backstreet Boys',
      albumart: 'https://i.ytimg.com/vi/eZx5NsZt_vw/hqdefault.jpg',
      providers: [{name:"Spotify", url:"http://spotify.url/helloidnumber"},
        {name:"iTunes", url:"ituneslink.com/helloidnumber"},
        {name:"Youtube", url:"youtube.com/helloidnumber"}]
      }).then(function(data){
        console.log(data._id);
      })

    var template = fs.readFileSync(path.join(__dirname, '../mustache/template.html'),'utf-8', function(err, data) {
      if (err) console.log(err);
    });

    //testdata
    var person = {
      title: "Hello",
      artist: "Adele",
      albumart: "http://ichef.bbci.co.uk/images/ic/256xn/p035xwsg.jpg",
      providers: 
        [{name:"Spotify", url:"http://spotify.url/helloidnumber"},
        {name:"iTunes", url:"ituneslink.com/helloidnumber"},
        {name:"Youtube", url:"youtube.com/helloidnumber"}]
    };
    var person2 = {
      title: "Hotline Bling",
      artist: "Drake",
      albumart: "http://cdn.pitchfork.com/tracks/17609/homepage_large.ee5af306.jpg",
      providers: 
        [{name:"Spotify", url:"http://spotify.url/hotlineidnumber"},
        {name:"iTunes", url:"ituneslink.com/hotlineidnumber"},
        {name:"Youtube", url:"youtube.com/hotlineidnumber"}]
    };
    var person3 = {
      title: "Shake it Off",
      artist: "Taylor Swift",
      albumart: "https://upload.wikimedia.org/wikipedia/en/c/c4/Taylor_Swift_-_Shake_It_Off.png",
      providers: 
        [{name:"Spotify", url:"http://spotify.url/shakeitoffnumber"},
        {name:"iTunes", url:"ituneslink.com/shakeitoffnumber"},
        {name:"Youtube", url:"youtube.com/shakeitoffnumber"}]
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
  },

  render2 : function (req, res, next) {

    var template = fs.readFileSync(path.join(__dirname, '../mustache/template.html'),'utf-8', function(err, data) {
      if (err) console.log(err);
    });

    Listener.findOne({title: 'I want it that way'}).then(function(person){
        var html = Mustache.render(template, person);
        res.send(html);
      });

  }
  
}

