var regex = require('./regex');

module.exports = {
	makeQuery: makeQuery
};

function makeQuery(song) {
	var title = song.title;
	var artist = song.artist;

	title = regex.removeAnythingAfterDash(title);
	artist = regex.removeAnythingAfterDash(artist);

	var query = title + ' ' + artist;
	
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
