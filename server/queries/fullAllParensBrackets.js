var regex = require('./regex');

module.exports = {
	makeQuery: makeQuery
};

function makeQuery(song) {
	var title = song.title;
	var artist = song.artist;
	var album = song.album_title;

	title = regex.removeAnythingAfterDash(title);
	artist = regex.removeAnythingAfterDash(artist);
	album = regex.removeAnythingAfterDash(album);

	var query = title + ' ' + album + ' ' + artist;
	
	query = regex.removeParensContents(query);
	query = regex.removeBracketsContents(query);

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
