import React, { Component } from 'react'
import Header from './Header'
import Footer from './Footer'

class App extends Component {

  render() {
    console.log(this.props.location.pathname)
    return (
      <div>
        <Header showCreateLinksLink={this.props.location.pathname !== '/'}/>
        {this.props.children}
        <Footer/>
      </div>
    )
  }

}

export default App
