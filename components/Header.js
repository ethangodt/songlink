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
            <div className="nav-container">
              <ul className="nav">
                <li style={ {display: this.props.showCreateLinksLink ? '' : 'none'} }><Link to="/">create link</Link></li>
                <li style={ {display: this.props.showCreateLinksLink ? 'none' : ''} }><Link to="/preferences">preferences</Link></li>
              </ul>
            </div>
          </div>
        </header>
      </div>
    )
  }

}

export default Header
