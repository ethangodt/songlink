import React, { Component } from 'react'
import Header from './Header'
import '../styles/main.scss'

class App extends Component {

  render() {
    return (
      <div>
        <div className="topStrip"></div>
        <div className="page">
          <Header/>
          {this.props.children}
        </div>  
      </div>
    )
  }

}

export default App
