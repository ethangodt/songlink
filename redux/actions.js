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
          var titles = res.map(function (song) {
            return song.title;
          })
          dispatch(actions.updateResults(titles));
        }
      });
    };

  }

};

module.exports = actions;
