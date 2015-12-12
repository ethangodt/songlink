module.exports = {
  convertArtist: convertArtist, 
  verifyArtistMatch: verifyArtistMatch,
  verifyMsMatch: verifyMsMatch
};

function convertArtist(artistStr) {
  return artistStr.toLowerCase().replace(/[^\w\s\\ ]/gi, '').replace(/[^\D\s\\ ]/gi, '').replace(/\s+/g, "");
};

function verifyArtistMatch(artist1, artist2) {
  return artist1.includes(artist2) || artist2.includes(artist1) ? true : false;
};

function verifyMsMatch(ms1, ms2) {
  return (Math.abs(ms1 - ms2) / ms2) < 0.03 ? true : false;
};