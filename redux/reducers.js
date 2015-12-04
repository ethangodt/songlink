var reducers = {

  resultsReducer: function (results, action) {

    results = results || [];

    switch (action.type) {

      case 'UPDATE_RESULTS':
        console.log(action.results);
        return action.results;

      default: 
        return results;
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
  },
  
  loadingReducer: function (loading, action) {

    loading = loading || {
      link: false,
      preference: false,
      search: false
    };

    switch (action.type) {
      case 'TOGGLE_LOADING_LINK':
        return Object.assign(
          {}, 
          loading,
          {
            link: action.isLoading,
            preference: loading.preference,
            search: loading.search
          }
        );

      case 'TOGGLE_LOADING_PREFERENCE':
        return Object.assign(
          {}, 
          loading,
          {
            link: loading.link,
            preference: action.isLoading,
            search: loading.search
          }
        );

      case 'TOGGLE_LOADING_SEARCH':
        return Object.assign(
          {}, 
          loading,
          {
            link: loading.link,
            preference: loading.preference,
            search: action.isLoading
          }
        );

      default: 
        return loading;
    }
  },

  preferenceReducer: function (preference, action) {
    
    preference = preference || 'none';

    switch (action.type) {

      case 'UPDATE_PREFERENCE':
        return action.preference

      default: 
        return preference;
    }

  }
};

module.exports = reducers;
