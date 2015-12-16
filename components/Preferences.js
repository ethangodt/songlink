import React, { Component, PropTypes } from 'react'
import * as actions from '../redux/actions';
import Links from './Links';
import RadioGroup from 'react-radio-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Search from './Search';

class Preferences extends Component {

  constructor(props, context) {
    super(props, context)

    // get cookie and set as state

    this.state = {
      hasSubmitted: false
    }
  }

  handleSubmit() {
    this.props.actions.submitPreference(this.state.preference)
    this.setState({ hasSubmitted: true })
  }

  handleClickSpotify() {
    this.setState({ preference: 'spotify' })
  }

  handleClickiTunes() {
    this.setState({ preference: 'itunes' })
  }

  handleClickYoutube() {
    this.setState({ preference: 'youtube' })
  }

  handleClickNone() {
    this.setState({ preference: 'none' })
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
            <div onClick={this.handleClickSpotify.bind(this)} className="radio">
              <span>Spotify</span><br/>
            </div>
            <div onClick={this.handleClickiTunes.bind(this)} className="radio">
              <span>iTunes</span><br/>
            </div>
            <div onClick={this.handleClickYoutube.bind(this)} className="radio"> 
              <span>Youtube</span><br/>
            </div>
            <div onClick={this.handleClickNone.bind(this)} className="radio">
              <span>None - do not redirect me.</span>
            </div>
          </div>
        </div>

        <button className="update-button" onClick={this.handleSubmit.bind(this)}>
          Update Preference
        </button>

        <div>{this.props.loading.preference ? 'updating preference...' : this.state.hasSubmitted ? 'updated successfully' : ' '}</div>
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
