import React from 'react';
import { createHistory } from 'history';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from '../components/App';

var initialState = {
  loading: {
    link: false,
    search: false
  },
  results: []
}

var store =  require('../redux/store')(initialState);

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);
