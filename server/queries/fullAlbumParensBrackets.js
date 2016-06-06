var regex = require('./regex');

module.exports = {
	makeQuery: makeQuery
};

function makeQuery(song) {
	var album = song.album_title;

	album = regex.removeParensContents(album);
	album = regex.removeBracketsContents(album);
	album = regex.removeAnythingAfterDash(album);

	var query = song.title + ' ' + album + ' ' + song.artist;

	query = regex.removePunctuation(query);

	var keywords = [
		' - Single',
		'feat.',
		'Pt.',
		'Pts.',
		' - ',
	];

	query = regex.removeKeywords(query, keywords);

	return query.toLowerCase();
}
