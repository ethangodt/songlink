var reducers = {

  resultsReducer: function (results, action) {
    results = results || '';

    switch (action.type) {

      case 'UPDATE_RESULTS':
        return action.results;

      default: 
        return results;
    }
  }
  
};

module.exports = reducers;
