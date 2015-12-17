module.exports = {
  convertArtist: convertArtist, 
  verifyArtistMatch: verifyArtistMatch,
  verifyMsMatch: verifyMsMatch
};

function convertArtist(artistStr) {
  return artistStr.toLowerCase();
  console.log(artistStr);
  // return artistStr.toLowerCase().replace(/[^\w\s\\ ]/gi, ' ').replace(/[^\D\s\\ ]/gi, '').replace(/\s+/g, " ");
};

function verifyArtistMatch(artist1, artist2) {
  return artist1.includes(artist2) || artist2.includes(artist1) ? true : false;
};

function verifyMsMatch(ms1, ms2) {
  return .97 < (ms1 / ms2) && (ms1 / ms2) < 1.03 ? true : false;
};