import $ from 'jquery'

export function addLink(link) {
	return {
		type: 'ADD_LINK',
		link: link
	}
}

export function addInvalidLink(id) {
	return {
		type: 'ADD_INVALID_LINK',
		invalidLink: id
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
			data: JSON.stringify(song),
			contentType: 'application/json',
			cache: false,
			error: err => {
				console.error(err)
				dispatch(toggleLoadingLink(false))
				if (err.responseText === 'Could not verify ID') {
					dispatch(addInvalidLink(song.source_id))
				} else {
					dispatch(toggleErrorCreateLink(true))
				}
			},
			success: res => {
				dispatch(addLink({
					url: res.share_link,
					artist: res.artist,
					title: res.title,
					album_title: res.album_title,
					album_art: res.album_art
				}))
				dispatch(toggleLoadingLink(false))
			}
		})
	}
}

export function search(text) {
	return (dispatch, getState) => {
		dispatch(clearResults())
		dispatch(toggleLoadingSearch(true))
		$.ajax({
			url: 'search',
			data: {
				search: text
			},
			cache: false,
			error: err => {
				console.error(err)
				dispatch(toggleLoadingSearch(false))
				if (err.responseText === 'Search returned no results') {
					dispatch(clearResults())
				}
			},
			success: res => {
				const songs = res;
				dispatch(toggleLoadingSearch(false))
				dispatch(updateResults(songs))
			}
		});
	}
}

export function toggleErrorCreateLink(isError) {
	return {
		type: 'TOGGLE_ERROR_CREATE_LINK',
		isError: isError
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

export function updateResults(results) {
	return {
		type: 'UPDATE_RESULTS',
		results: results
	}
}
