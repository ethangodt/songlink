import $ from 'jquery';

var actions = {

  updateResults: function (results) {
    return {
      type: 'UPDATE_RESULTS',
      results: results
    };
  },

  search: function(text) {

    return function(dispatch, getState) {
      $.ajax({
        url: 'search',
        data: {
          search: text
        },
        cache: false,
        error: function(err) {
          console.error(err);
        },
        success: function(res) {
          console.log(res);
          var titles = res.results.map(function (song) {
            return {title: song.trackName, artist: song.artistName, artwork: song.artworkUrl60};
          })
          dispatch(actions.updateResults(titles));
        }
      });
    };

  }

};

module.exports = actions;
