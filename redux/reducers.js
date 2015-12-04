var reducers = {

  resultsReducer: function (results, action) {

    results = results || [];

    switch (action.type) {

      case 'UPDATE_RESULTS':
        return action.results;

      default: 
        return results;
    }
  },

  loadingReducer: function (loading, action) {

    loading = loading || false;

    switch (action.type) {
      case 'TOGGLE_LOADING_LINK':
        return Object.assign(
          {}, 
          loading,
          {
            link: action.isLoading,
            search: loading.search
          }
        );

      case 'TOGGLE_LOADING_SEARCH':
        return Object.assign(
          {}, 
          loading,
          {
            link: loading.link,
            search: action.isLoading
          }
        );

      default: 
        return loading;
    }
  },

  linksReducer: function (links, action) {

    links = links || [];

    switch (action.type) {
      case 'ADD_LINK':
        return [action.link, ...links];
      default: 
        return links;
    }
  }
  
};

module.exports = reducers;
