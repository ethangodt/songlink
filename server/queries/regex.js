module.exports = {
	removeAnythingAfterDash: removeAnythingAfterDash,
	removeBracketsContents: removeBracketsContents,
	removeKeywords: removeKeywords,
	removeNumbers: removeNumbers,
	removeParensContents: removeParensContents,
	removePunctuation: removePunctuation
};

function removeAnythingAfterDash(query) {
	return query.replace(/ - (.*)/, ' ');
}

function removeBracketsContents(query) {
	return query.replace(/ *\[[^)]*\] */g, ' ');
}

function removeKeywords(query, keywords) {

	keywords.forEach(function(keyword) {
		var regex = new RegExp(keyword, 'gi');
		query = query.replace(regex, ' ');
	});

	return query;
}

function removeParensContents(query) {
	return query.replace(/ *\([^)]*\) */g, ' ');
}

function removePunctuation(query) {
	return query.replace(/[&#\[\]()]/gi, ' ');
}

function removeNumbers(query) {
	return query.replace(/\d/g, '');
}
