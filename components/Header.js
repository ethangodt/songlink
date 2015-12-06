import React, { Component } from 'react'
import { Link } from 'react-router'

class Header extends Component {

  render() {
    return (
      <div>
        <h1>songl.ink</h1>
        <h4>
          <Link style={ {paddingRight: 20} } to="/">main</Link>
          <Link to="/preferences">preferences</Link>
        </h4>
      </div>
    )
  }

}

export default Header
