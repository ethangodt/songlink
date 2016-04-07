import errors from './errors'
import invalidLinks from './invalidLinks'
import links from './links'
import loading from './loading'
import { combineReducers } from 'redux'
import results from './results'

const rootReducer = combineReducers({
	errors: errors,
	invalidLinks: invalidLinks,
	links: links,
	loading: loading,
	results: results
})

export default rootReducer
