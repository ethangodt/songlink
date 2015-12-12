import React, { Component } from 'react'
import { Link } from 'react-router'

class Header extends Component {

  render() {
    return (
      <header>
        <Link to="/">
          <div className="branding mainBranding">
            <h1 className="logo mainLogo">songlink</h1>
            <p className="tagline">share with anyone</p>
          </div>
        </Link>
        <Link to="/preferences">
          <button className="mini settings">
            <svg className="buttonImage" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-3093 613 412 412" xmlSpace="preserve">
              <path id="gear-icon" d="M-2681,846.7v-55.5l-30-10.7c-11.4-4.1-20.6-12.8-25.3-24c0,0,0,0,0,0c-4.7-11.2-4.3-23.9,0.9-34.9
                l13.7-28.7l-39.2-39.2l-28.7,13.7c-11,5.2-23.7,5.5-34.9,0.9c0,0,0,0,0,0c-11.2-4.6-19.9-13.8-24-25.3l-10.7-30h-55.5l-10.7,30
                c-4.1,11.4-12.8,20.6-24,25.3c0,0,0,0,0,0c-11.2,4.7-23.9,4.3-34.9-0.9l-28.7-13.7l-39.2,39.2l13.7,28.7c5.2,11,5.5,23.7,0.9,34.9
                c0,0,0,0,0,0c-4.6,11.2-13.8,19.9-25.3,24l-30,10.7v55.5l30,10.7c11.4,4.1,20.6,12.8,25.3,24c0,0,0,0,0,0
                c4.7,11.2,4.3,23.9-0.9,34.9l-13.7,28.7l39.2,39.2l28.7-13.7c11-5.2,23.7-5.5,34.9-0.9c0,0,0,0,0,0c11.2,4.6,19.9,13.8,24,25.3
                l10.7,30h55.5l10.6-29.8c4.1-11.5,12.9-20.8,24.2-25.5c0,0,0,0,0,0c11.1-4.6,23.7-4.3,34.6,0.9l28.9,13.7l39.2-39.2l-13.7-28.7
                c-5.2-11-5.5-23.7-0.9-34.9c0,0,0,0,0,0c4.7-11.2,13.8-19.9,25.3-24L-2681,846.7z M-2887,894.5c-41.7,0-75.5-33.8-75.5-75.5
                s33.8-75.5,75.5-75.5c41.7,0,75.5,33.8,75.5,75.5S-2845.3,894.5-2887,894.5z"></path>
            </svg>
          </button>
        </Link>
      </header>
    )
  }

}

export default Header
