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
			var template = fs.readFileSync(path.join(__dirname, '../templates/error.html'), 'utf-8');
			var html = Mustache.render(template, undefined, getPartialsObject());
			res.send(html);
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

	var template = fs.readFileSync(path.join(__dirname, '../templates/linkPage.html'), 'utf-8');
	var html = Mustache.render(template, data, getPartialsObject());
	res.send(html);
}

function getPartialsObject() {
	return {
		analytics: fs.readFileSync(path.join(__dirname, '../templates/inc/analytics.html'), 'utf-8'),
		footer: fs.readFileSync(path.join(__dirname, '../templates/inc/footer.html'), 'utf-8'),
		header: fs.readFileSync(path.join(__dirname, '../templates/inc/header.html'), 'utf-8'),
		modal: fs.readFileSync(path.join(__dirname, '../templates/inc/modal.html'), 'utf-8'),
		og: fs.readFileSync(path.join(__dirname, '../templates/inc/og.html'), 'utf-8'),
		providerLinks: fs.readFileSync(path.join(__dirname, '../templates/inc/providerLinks.html'), 'utf-8'),
		songContainer: fs.readFileSync(path.join(__dirname, '../templates/inc/songContainer.html'), 'utf-8'),
		twitter: fs.readFileSync(path.join(__dirname, '../templates/inc/twitter.html'), 'utf-8')
	}
}
