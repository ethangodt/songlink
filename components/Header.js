import React, { Component } from 'react'
import { Link } from 'react-router'

class Header extends Component {

  render() {
    return (
      <div>
        <div className="top-strip"></div>
        <header>
          <div className="wrapper">
            <Link to="/">
              <div className="logo-container">
                <div className="logo">
                  <span>songlink</span><br/>
                  <span className="tagline">share with anyone</span>
                </div>
              </div>
            </Link>
            <Link to="/preferences">
              <button className="preferences">
                <span className="fa fa-cog"></span>
              </button>
            </Link>
          </div>
        </header>
      </div>
    )
  }

}

export default Header
