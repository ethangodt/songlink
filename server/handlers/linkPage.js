var fs = require('fs');
var Mustache = require('mustache');
var path = require('path');
var providers = require('../providers');
var songCtrl = require('../db/controllers/songController');
var utils = require('../utils/utils');

module.exports = {
  render: render
};

function render(req, res) {

  var provider;

  if (!req.cookies.providerPreference || req.cookies.providerPreference === 'none' || !providers[req.cookies.providerPreference]) {
    provider = 'none';
  } else {
    provider = req.cookies.providerPreference;
  }

  songCtrl.get({ hash_id : req.params.id }, function(err, songFromDb) {
    if (songFromDb) {
      if (songFromDb.itunes_id) {
        sendProviderOld(req, res, songFromDb, provider);
      } else {
        sendProvider(req, res, songFromDb, provider);
      }
    } else {
      res.status(404).sendFile(path.join(__dirname, '../templates/404.html'));
    }
  });
}

function sendProvider (req, res, song, provider) {
  
  var template = fs.readFileSync(path.join(__dirname, '../templates/linkTemplate/template.html'),'utf-8', function(err, data) {
    if (err) {
      console.error(err);
    }
  });

  var topSpotifyResult = providers.spotify.getTopSpotifyResult(song);
  var topItunesResult = providers.itunes.getTopItunesResult(song);
  var topYoutubeResult = providers.youtube.getTopYoutubeResult(song);
  var topDeezerResult = providers.deezer.getTopDeezerResult(song);

  var providerUrl;

  if (provider === 'youtube') {
    providerUrl = providers.youtube.makeLinkFromId(topYoutubeResult.id);
  } else if (provider === 'itunes') {
    providerUrl = providers.itunes.makeLink(topItunesResult.trackId);
  } else if (provider === 'spotify') {
    providerUrl = providers.spotify.makeUriFromId(topSpotifyResult.id);
  } else if (provider === 'deezer') {
    providerUrl = providers.deezer.getLink(topDeezerResult);
  }

  var templateObj = {
    pageUrl : utils.makeSongLinkUrl(req.headers.host, song.hash_id),
    title : song.title,
    artist : song.artist,
    album_art : providers.spotify.getAlbumArtUrl(song, 'large') || providers.itunes.getAlbumArtUrl(song),
    providers : createProvidersArray(topSpotifyResult, topItunesResult, topYoutubeResult, topDeezerResult),
    providerUrl : providerUrl,
    provider : provider
  };

  var html = Mustache.render(template, templateObj);
  res.send(html);
}

function createProvidersArray (spotifySong, itunesSong, youtubeSong, deezerSong) {

  return [
  {
    provider: 'spotify',
    name: 'Spotify',
    icon: 'spotify',
    url : spotifySong ? providers.spotify.makeUriFromId(spotifySong.id) : undefined,
    text : spotifySong ? 'Play now on Spotify' : 'Not available on Spotify',
    className : spotifySong ? 'fullWidth spotify' : 'fullWidth disabled spotify'
  },
  {
    provider: 'youtube',
    name: 'YouTube',
    icon: 'youtube-play',
    url : youtubeSong ? providers.youtube.makeLinkFromId(youtubeSong.id) :undefined,
    text : youtubeSong ? 'Play now on YouTube' : 'Not available on YouTube',
    className : youtubeSong ? 'fullWidth youtube' : 'fullWidth disabled youtube'
  },
  {
    provider: 'itunes',
    name: 'Apple Music',
    icon: 'apple',
    url : itunesSong ? providers.itunes.makeLink(itunesSong) : undefined,
    text : itunesSong ? providers.itunes.makeText(itunesSong) : 'Not available on iTunes',
    className : itunesSong ? 'fullWidth iTunes' : 'fullWidth disabled iTunes'
  },
  {
    provider : 'deezer',
    name: 'Deezer',
    icon: 'play-circle-o',
    url : deezerSong ? providers.deezer.getLink(deezerSong) : undefined,
    text : deezerSong ? 'Play now on Deezer' : 'Not available on Deezer',
    className : deezerSong ? 'fullWidth spotify' : 'fullWidth disabled spotify'
  }];

}

function sendProviderOld(req, res, songFromDb, provider) {
  
  var template = fs.readFileSync(path.join(__dirname, '../templates/linkTemplate/template.html'),'utf-8', function(err, data) {
      if (err) {
        console.error(err);
      }
    });

    var providerUrl = undefined;

    if (provider === 'youtube') {
      providerUrl = providers['youtube'].makeLinkFromId(songFromDb['youtube_id']);
    } else if (provider === 'itunes') {
      providerUrl = songFromDb.itunes_app_uri || songFromDb.itunes_store_uri;
    } else if (provider === 'spotify') {
      providerUrl = providers['spotify'].makeUriFromId(songFromDb['spotify_id']);
    }

    var templateObj = {
      pageUrl : utils.makeSongLinkUrl(req.headers.host, songFromDb.hash_id),
      title : songFromDb.title,
      artist : songFromDb.artist,
      album_art : songFromDb.spotify_images ? songFromDb.spotify_images.medium_image.url : songFromDb.album_art,
      providers : createProvidersArrayOld(songFromDb),
      clicks : songFromDb.clicks,
      creates : songFromDb.creates,
      providerUrl : providerUrl,
      provider : provider
    };

    var html = Mustache.render(template, templateObj);
    res.send(html);
}

function createProvidersArrayOld(song) {

  function iTunesText(song) {
      if (!song.itunes_id) {
        return 'Not available on iTunes';
      } else if (song.itunes_app_uri) {
        return 'Play now in Apple Music';
      } else {
        return 'Open now in iTunes Store';
      }
    }

    function iTunesUrl(song) {
      if (!song.itunes_id) {
        return undefined;
      } else if (song.itunes_app_uri) {
        return song.itunes_app_uri;
      } else {
        return song.itunes_store_uri;
      }
    }

    var providersArray = [{
      provider: 'spotify',
      icon: 'spotify',
      url : song.spotify_id ? providers.spotify.makeUriFromId(song.spotify_id) : undefined,
      text : song.spotify_id ? 'Play now in Spotify' : 'Not available on Spotify',
      className : song.spotify_id ? 'fullWidth spotify' : 'fullWidth disabled spotify'
    },
    {
      provider: 'youtube',
      icon: 'youtube-play',
      url : song.youtube_id ? providers.youtube.makeLinkFromId(song.youtube_id) :undefined,
      text : song.youtube_id ? 'Play now in YouTube' : 'Not available on YouTube',
      className : song.youtube_id ? 'fullWidth youtube' : 'fullWidth disabled youtube'
    },
    {
      provider: 'itunes',
      icon: 'apple',
      url : iTunesUrl(song) ? iTunesUrl(song) : undefined,
      text : iTunesText(song) ? 'Play now in iTunes' : 'Not available on iTunes',
      className : song.itunes_id ? 'fullWidth iTunes' : 'fullWidth disabled iTunes'
    }];

    return providersArray;

}

