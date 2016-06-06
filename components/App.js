import React, { Component } from 'react'
import Header from './Header'
import Footer from './Footer'

class App extends Component {

	render() {

		return (
			<div className="app">
				<div className='mainContent'>
					<Header showCreateLinksLink={this.props.location.pathname !== '/'}/>
					{this.props.children}
				</div>
				<Footer/>
			</div>
		)
	}

}

export default App
