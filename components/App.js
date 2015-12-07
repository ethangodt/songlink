import React, { Component } from 'react'
import Header from './Header'
import '../styles/main.scss'

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
