import React, { Component, PropTypes } from 'react'
import * as actions from '../redux/actions'
import Links from './Links'
import RadioGroup from 'react-radio-group'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Search from './Search'
import classnames from 'classnames'
import docCookies from '../server/templates/linkTemplate/scripts/listenerTools'

class Preferences extends Component {

  constructor(props, context) {
    super(props, context)

    this.state = {
      updated: false,
      preference: docCookies.getItem('providerPreference')
    }
  }

  // handleSubmit() {
  //   docCookies.setItem('providerPreference', this.state.preference)
  //   this.setState({ hasSubmitted: true })
  // }

  handleClickSpotify() {
    this.setState({ preference: 'spotify' })
    docCookies.setItem('providerPreference', 'spotify')
  }

  handleClickiTunes() {
    this.setState({ preference: 'itunes' })
    docCookies.setItem('providerPreference', 'itunes')
  }

  handleClickYoutube() {
    this.setState({ preference: 'youtube' })
    docCookies.setItem('providerPreference', 'youtube')
  }

  handleClickNone() {
    this.setState({ preference: 'none' })
    docCookies.setItem('providerPreference', 'none')
  }

  render() {
    return (
      <div className="preferences wrapper">

        <h2 className="header">redirect</h2>

        <p className="redirect-info">Songlink works best when you tell us where you listen to music. 
          Next time you click on a songlink we’ll open your app for you automatically.
        </p>

        <div className="radio-group">
          <div>
            <div 
              className={classnames({
                'radio': true,
                'selected': this.state.preference === 'spotify'
              })}
              onClick={this.handleClickSpotify.bind(this)}
            > 
              <span className="fa fa-spotify"></span><span> Spotify</span><br/>
            </div>
            <div 
              className={classnames({
                'radio': true,
                'selected': this.state.preference === 'itunes'
              })}
              onClick={this.handleClickiTunes.bind(this)}
            > 
              <span className="fa fa-apple"></span><span> iTunes</span><br/>
            </div>
            <div 
              className={classnames({
                'radio': true,
                'selected': this.state.preference === 'youtube'
              })}
              onClick={this.handleClickYoutube.bind(this)}
            > 
              <span className="fa fa-youtube"></span><span> YouTube</span><br/>
            </div>
            <div 
              className={classnames({
                'radio': true,
                'selected': this.state.preference === 'none'
              })}
              onClick={this.handleClickNone.bind(this)}
            > 
              <span>Do not redirect me</span>
            </div>
          </div>
        </div>
        
      </div>
    )
  }

}

Preferences.propTypes = {
  loading: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    loading: state.loading
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Preferences)
