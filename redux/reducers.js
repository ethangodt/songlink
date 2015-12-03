var reducers = {

  resultsReducer: function (state, action) {
    state = state || '';

    switch (action.type) {

      case 'SEARCH':
        return action.text;

      default: 
        return state;
    }
  }
  
};

module.exports = reducers;
