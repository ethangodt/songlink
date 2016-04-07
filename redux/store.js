import rootReducer from './reducers'
import { applyMiddleware, compose, createStore } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

let middleware = [ thunk ]

if (window.location.hostname === 'localhost') {
	middleware.push(logger())
}

const finalCreateStore = compose(
	applyMiddleware(...middleware)
)(createStore)

export default function configureStore(initialState) {
	const store = finalCreateStore(rootReducer, initialState)

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('./reducers', () => {
			const nextReducer = require('./reducers')
			store.replaceReducer(nextReducer)
		})
	}
	
	return store
}
