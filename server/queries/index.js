var full = require('./full');
var fullAlbumParensBrackets = require('./fullAlbumParensBrackets');
var fullAllParensBrackets = require('./fullAllParensBrackets');
var fullPuncKeywords = require('./fullPuncKeywords');
var partial = require('./partial');
var partialAllParensBrackets = require('./partialAllParensBrackets');
var partialPuncKeywords = require('./partialPuncKeywords');

module.exports = {
	'full': full,
	'full-albumParensBrackets': fullAlbumParensBrackets,
	'full-allParensBrackets': fullAllParensBrackets,
	'full-punc-keywords': fullPuncKeywords,
	'partial': partial,
	'partial-allParensBrackets': partialAllParensBrackets,
	'partial-punc-keywords': partialPuncKeywords
};
