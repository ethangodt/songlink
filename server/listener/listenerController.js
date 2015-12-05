
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

    console.log('params',req.params.id);
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
    var song = {
      title: "Hello",
      artist: "Adele",
      albumart: "http://ichef.bbci.co.uk/images/ic/256xn/p035xwsg.jpg",
      providers: 
        [{name:"Spotify", url:"http://spotify.url/helloidnumber"},
        {name:"iTunes", url:"ituneslink.com/helloidnumber"},
        {name:"Youtube", url:"youtube.com/helloidnumber"}]
    };
    var song2 = {
      title: "Hotline Bling",
      artist: "Drake",
      albumart: "http://cdn.pitchfork.com/tracks/17609/homepage_large.ee5af306.jpg",
      providers: 
        [{name:"Spotify", url:"spotify:track:0ENSn4fwAbCGeFGVUbXEU3"},
        {name:"iTunes", url:"https://open.spotify.com/track/0ENSn4fwAbCGeFGVUbXEU3"},
        {name:"Youtube", url:"https://www.youtube.com/watch?v=42Gtm4-Ax2U"}]
    };
    var song3 = {
      title: "Shake it Off",
      artist: "Taylor Swift",
      albumart: "https://upload.wikimedia.org/wikipedia/en/c/c4/Taylor_Swift_-_Shake_It_Off.png",
      providers: 
        [{name:"Spotify", url:"http://spotify.url/shakeitoffnumber"},
        {name:"iTunes", url:"ituneslink.com/shakeitoffnumber"},
        {name:"Youtube", url:"youtube.com/shakeitoffnumber"}]
    };

    var html = Mustache.render(template, song);
    var html2 = Mustache.render(template, song2);
    var html3 = Mustache.render(template, song3);

    if (req.params.id === '1') {
      res.send(html);
    } else if (req.params.id === '2') {
      res.send(html2);
    } else if (req.params.id === '3') {
      res.send(html3);
    }
  },

  render2 : function (req, res, next) {

    var template = fs.readFileSync(path.join(__dirname, '../mustache/template.html'),'utf-8', function(err, data) {
      if (err) console.log(err);
    });

    Listener.findOne({title: 'I want it that way'}).then(function(song){
        var html = Mustache.render(template, song);
        res.send(html);
      });

  }
  
}

