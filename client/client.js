import React from 'react';
import App from '../components/App';
import { createHistory } from 'history';
import Main from '../components/Main';
import Preferences from '../components/Preferences';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { IndexRoute, Route, Router } from 'react-router';
import configureStore from '../redux/store';

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
