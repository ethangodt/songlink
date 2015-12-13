import React, { Component } from 'react'
import { Link } from 'react-router'

class Header extends Component {

  render() {
    return (
      <header>
        <div className="wrapper">
          <Link to="/">
            <h1 className="logo">songlink</h1>
          </Link>
          <Link to="/preferences">
            <button className="preferences">
              <span className="fa fa-cog"></span>
            </button>
          </Link>
        </div>
      </header>
    )
  }

}

export default Header
