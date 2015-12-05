import $ from 'jquery';

var actions = {

  updateResults: function (results) {
    return {
      type: 'UPDATE_RESULTS',
      results: results
    };
  },

  addLink: function (link) {
    return {
      type: 'ADD_LINK',
      link: link
    }
  },

  toggleLoadingLink: function (isLoading) {
    return {
      type: 'TOGGLE_LOADING_LINK',
      isLoading: isLoading
    }
  },

  toggleLoadingPreference: function (isLoading) {
    return {
      type: 'TOGGLE_LOADING_PREFERENCE',
      isLoading: isLoading
    }
  },

  toggleLoadingSearch: function (isLoading) {
    return {
      type: 'TOGGLE_LOADING_SEARCH',
      isLoading: isLoading
    }
  },

  updatePreference: function (preference) {
    return {
      type: 'UPDATE_PREFERENCE',
      preference: preference
    }
  },

  clearResults: function () {
    return {
      type: 'CLEAR_RESULTS'
    }
  },

  submitPreference: function (preference) {

    return function (dispatch, getState) {
      
      dispatch(actions.toggleLoadingPreference(true));

      setTimeout(function () {
        dispatch(actions.toggleLoadingPreference(false));
        dispatch(actions.updatePreference(preference));
      }, 1300)

    };
  },

  search: function (text) {

    return function (dispatch, getState) {
      
      dispatch(actions.toggleLoadingSearch(true));

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
          var songs = res.results.map(function (song) {
            return {title: song.trackName, artist: song.artistName, artwork: song.artworkUrl60};
          });
          dispatch(actions.toggleLoadingSearch(false));
          dispatch(actions.updateResults(songs));
        }
      });
    };

  },

  createLink: function (song) {

    return function (dispatch, getState) {
      
      dispatch(actions.toggleLoadingLink(true));
      
      setTimeout(function () {
        dispatch(actions.addLink(song));
        dispatch(actions.toggleLoadingLink(false));
      }, 1000)

    }
  }

};

module.exports = actions;
