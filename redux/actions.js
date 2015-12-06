import $ from 'jquery'

export function addLink(link) {
  return {
    type: 'ADD_LINK',
    link: link
  }
}

export function clearResults() {
  return {
    type: 'CLEAR_RESULTS'
  }
}

export function createLink(song) {
  return (dispatch, getState) => {
    dispatch(toggleLoadingLink(true))
    $.ajax({
      url: 'create',
      method: 'POST',
      data: {
        song: song
      },
      cache: false,
      error: err => {
        console.error(err)
      },
      success: res => {
        console.log('got a response from post to /create')
      }
    })
    setTimeout( () => {
      dispatch(addLink(song.album_art))
      dispatch(toggleLoadingLink(false))
    }, 1000)
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
        console.error(err)
      },
      success: res => {
        const songs = res.map(song => {
          return {
            name: song.name,
            album_name: song.album_name,
            artist: song.artist,
            itunes_id: song.itunes_id,
            album_art: song.album_art,
            album_art_size: song.album_art_size
          }
        })
        dispatch(toggleLoadingSearch(false))
        dispatch(updateResults(songs))
      }
    })
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
