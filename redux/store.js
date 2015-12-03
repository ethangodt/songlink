import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import { resultsReducer } from './reducers';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

var finalCreateStore = compose(
  applyMiddleware(thunk, logger())
)(createStore);

var rootReducer = combineReducers({
  results: resultsReducer
});

var configureStore = function(initialState) {
  initialState = initialState;
  return finalCreateStore(rootReducer, initialState);
};

module.exports = configureStore;
