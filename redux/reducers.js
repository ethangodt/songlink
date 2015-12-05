export function linksReducer(links = [], action) {
  switch (action.type) {
    case 'ADD_LINK':
      return [action.link, ...links]
    default: 
      return links
  }
}

export function loadingReducer(loading, action) {
  
  loading = loading || {
    link: false,
    preference: false,
    search: false
  }

  switch (action.type) {
    case 'TOGGLE_LOADING_LINK':
      return Object.assign({}, loading, {
        link: action.isLoading,
        preference: loading.preference,
        search: loading.search
      })
    case 'TOGGLE_LOADING_PREFERENCE':
      return Object.assign({}, loading, {
        link: loading.link,
        preference: action.isLoading,
        search: loading.search
      })
    case 'TOGGLE_LOADING_SEARCH':
      return Object.assign({}, loading, {
        link: loading.link,
        preference: loading.preference,
        search: action.isLoading
      })
    default: 
      return loading
  }
}

export function preferenceReducer(preference = 'none', action) {
  switch (action.type) {
    case 'UPDATE_PREFERENCE':
      return action.preference
    default: 
      return preference
  }
}

export function resultsReducer(results = [], action) {
  switch (action.type) {
    case 'UPDATE_RESULTS':
      return action.results
    case 'CLEAR_RESULTS':
      return []
    default: 
      return results
  }
}
