import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import * as reducers from './reducers';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

var finalCreateStore = compose(
  applyMiddleware(thunk, logger())
)(createStore);

var rootReducer = combineReducers({
  links: reducers.linksReducer,
  loading: reducers.loadingReducer,
  preference: reducers.preferenceReducer,
  results: reducers.resultsReducer
});

var configureStore = function(initialState) {
  initialState = initialState;
  return finalCreateStore(rootReducer, initialState);
};

module.exports = configureStore;
