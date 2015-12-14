import React, { Component } from 'react'
import Header from './Header'
import '../sass/main.scss'

class App extends Component {

  render() {
    return (
      <div>
        <Header/>
        {this.props.children}
      </div>
    )
  }

}

export default App
