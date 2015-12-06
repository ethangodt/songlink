import React from 'react';
import { createHistory } from 'history';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { IndexRoute, Route, Router } from 'react-router';
import configureStore from '../redux/store';
import App from '../components/App';
import Main from '../components/Main';
import Preferences from '../components/Preferences';

const initialState = {
  loading: {
    link: false,
    preference: false,
    search: false
  },
  preference: 'spotify',
  results: []
}


render(
  <Provider store={ configureStore() }>
    <Router history={ createHistory() }>
      <Route path="/" component={ App }>
        <IndexRoute component={ Main }/>
        <Route path="preferences" component={ Preferences }/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
