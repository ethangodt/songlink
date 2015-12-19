import React, { Component } from 'react'
import docCookies from '../server/templates/linkTemplate/scripts/listenerTools'
import PreferencesGroup from './PreferencesGroup'

class Preferences extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      updated: false,
      selected: docCookies.getItem('providerPreference') || 'none'
    }
  }

  handleSubmit() {
    docCookies.setItem('providerPreference', this.state.selected)
    this.displayUpdatedMessage()
  }

  displayUpdatedMessage() {
    this.setState({ updated: true })
    setTimeout(() => {
      this.setState({ updated: false })
    }.bind(this), 2000)
  }

  handleClick(e) {
    var selected;

    if (e.target.classList.contains('spotify')) {
      selected = 'spotify';
    } else if (e.target.classList.contains('itunes')) {
      selected = 'itunes';
    } else if (e.target.classList.contains('youtube')) {
      selected = 'youtube';
    } else {
      selected = 'none';
    }

    this.setState({
      selected: selected
    });
  }

  render() {
    return (
      <div className="preferences wrapper">

        <h2 className="header">redirect</h2>

        <p className="redirect-info">Songlink works best when you tell us where you listen to music. 
          Next time you click on a songlink we’ll open your app for you automatically.
        </p>

        <PreferencesGroup selected={this.state.selected} handleClick={this.handleClick.bind(this)}/>

        <button className="save-button" onClick={this.handleSubmit.bind(this)}>Save</button>
        
        <div className="update-message">{this.state.updated ? 'saved successfully!' : undefined}</div>

      </div>
    )
  }

}

export default Preferences
