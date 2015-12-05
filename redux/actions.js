import $ from 'jquery'

export function addLink(link) {
  return {
    type: 'ADD_LINK',
    link: link
  }
}

export function toggleLoadingLink(isLoading) {
  return {
    type: 'TOGGLE_LOADING_LINK',
    isLoading: isLoading
  }
}

export function toggleLoadingPreference(isLoading) {
  return {
    type: 'TOGGLE_LOADING_PREFERENCE',
    isLoading: isLoading
  }
}

export function toggleLoadingSearch(isLoading) {
  return {
    type: 'TOGGLE_LOADING_SEARCH',
    isLoading: isLoading
  }
}

export function updatePreference(preference) {
  return {
    type: 'UPDATE_PREFERENCE',
    preference: preference
  }
}

export function updateResults(results) {
  return {
    type: 'UPDATE_RESULTS',
    results: results
  }
}

export function clearResults() {
  return {
    type: 'CLEAR_RESULTS'
  }
}

export function submitPreference(preference) {
  return dispatch => {
    dispatch(toggleLoadingPreference(true))
    setTimeout(() => {
      dispatch(toggleLoadingPreference(false))
      dispatch(updatePreference(preference))
    }, 1300)
  }
}

export function search(text) {
  return (dispatch, getState) => {  
    dispatch(toggleLoadingSearch(true))
    $.ajax({
      url: 'search',
      data: {
        search: text
      },
      cache: false,
      error: err => {
        console.error(err);
      },
      success: res => {
        const songs = res.results.map(song => {
          return {title: song.trackName, artist: song.artistName, artwork: song.artworkUrl60}
        });
        dispatch(toggleLoadingSearch(false))
        dispatch(updateResults(songs))
      }
    })
  }
}

export function createLink(song) {
  return (dispatch, getState) => {
    dispatch(toggleLoadingLink(true))
    setTimeout( () => {
      dispatch(addLink(song))
      dispatch(toggleLoadingLink(false))
    }, 1000)
  }
}
