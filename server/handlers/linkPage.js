var fs = require('fs');
var Mustache = require('mustache');
var path = require('path');
var providers = require('../providers');
var songCtrl = require('../db/controllers/songController');
var utils = require('../utils/utils');

module.exports = {
	getSong: getSong,
	render: render
};

function getSong(req, res, next) {
	songCtrl.get({ hash_id : req.params.id }, function(err, songFromDb) {
		if (songFromDb) {
			req.song = songFromDb;
			next();
		} else {
			res.status(404).sendFile(path.join(__dirname, '../templates/404.html'));
		}
	});
}

function render(req, res) {

	var cookie = req.cookies.providerPreference;
	var preference = cookie && providers[cookie] ? cookie : undefined

	var data = {
		songlinkUrl: utils.makeSonglinkUrl(req.song),
		title: req.song.title,
		artist: req.song.artist,
		album_art: utils.getAlbumArtUrl(req.song),
		providers: utils.createProvidersArray(req.song),
		preferredProviderUrl: preference && providers[preference].makeLink(req.song)
	};

	fs.readFile(path.join(__dirname, '../templates/linkTemplate/template.html'),'utf-8', function(err, template) {
		if (err) {
			console.error(err);

			// this should probably be a 500 error page
			return res.status(404).sendFile(path.join(__dirname, '../templates/404.html'));
		}

		var html = Mustache.render(template, data);
		res.send(html);
	});
}
