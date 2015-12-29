import React, { Component } from 'react'
import docCookies from '../server/templates/linkTemplate/scripts/listenerTools'
import PreferencesGroup from './PreferencesGroup'

class Preferences extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      updated: false,
      selected: docCookies.getItem('providerPreference')
    }
  }

  handleSubmit() {
    docCookies.setItem('providerPreference', this.state.selected, 'Fri, 31 Dec 2030 23:59:59 GMT')
    this.displayUpdatedMessage()
  }

  displayUpdatedMessage() {
    this.setState({ updated: true })
    setTimeout(() => {
      this.setState({ updated: false })
    }.bind(this), 2000)
  }

  handleClick(e) {
    let selected = null
    let classes = e.target.classList

    if (Array.prototype.indexOf.call(classes, 'spotify') !== -1) {
      selected = 'spotify';
    } else if (Array.prototype.indexOf.call(classes, 'itunes') !== -1) {
      selected = 'itunes';
    } else if (Array.prototype.indexOf.call(classes, 'google') !== -1) {
      selected = 'google';
    } else if (Array.prototype.indexOf.call(classes, 'youtube') !== -1) {
      selected = 'youtube';
    } else if (Array.prototype.indexOf.call(classes, 'deezer') !== -1) {
      selected = 'deezer';
    } else if (Array.prototype.indexOf.call(classes, 'none') !== -1) {
      selected = 'none';
    }

    this.setState({
      selected: selected
    })
  }

  render() {
    return (
      <div className="preferences wrapper">

        <h2 className="header">automatic redirects</h2>

        <p className="redirect-info">Songlink works best when you tell us where you listen to music.
          Next time you click on a songlink we’ll open that song in your music app automatically.
        </p>

        <PreferencesGroup selected={this.state.selected} handleClick={this.handleClick.bind(this)}/>

        <button className="save-button" onClick={this.handleSubmit.bind(this)}>Save</button>

        <div className="update-message">{this.state.updated ? 'saved successfully!' : undefined}</div>

      </div>
    )
  }

}

export default Preferences
