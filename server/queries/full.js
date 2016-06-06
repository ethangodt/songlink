module.exports = {
	makeQuery: makeQuery
};

function makeQuery(song) {
	var query = song.title + ' ' + song.album_title + ' ' + song.artist;
	return query.toLowerCase();
}
