import React from 'react';
import { createHistory } from 'history';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, Link } from 'react-router'
import App from '../components/App';
import Create from '../components/Create';
import Song from '../components/Song';

var initialState = {
  results: ''
}

var store =  require('../redux/store')(initialState);

render(
  <Provider store={store}>
    <Router history={createHistory()}>
      <Route path="/" component={App}>
        <IndexRoute component={Create}/>
        <Route path="song/:id" component={Song}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
