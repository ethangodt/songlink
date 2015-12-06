import links from './links'
import loading from './loading'
import preference from './preference'
import { combineReducers } from 'redux'
import results from './results'

const rootReducer = combineReducers({
  links: links,
  loading: loading,
  preference: preference,
  results: results
})

export default rootReducer
