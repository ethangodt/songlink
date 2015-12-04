import React from 'react';
import { createHistory } from 'history';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { IndexRoute, Route, Router } from 'react-router';
import App from '../components/App';
import Main from '../components/Main';
import Preferences from '../components/Preferences';

var initialState = {
  loading: {
    link: false,
    preference: false,
    search: false
  },
  preference: 'spotify',
  results: []
}

var store =  require('../redux/store')(initialState);

render(
  <Provider store={store}>
    <Router history={createHistory()}>
      <Route path="/" component={App}>
        <IndexRoute component={Main}/>
        <Route path="preferences" component={Preferences}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
