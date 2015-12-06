import React, { Component, PropTypes } from 'react'
import * as actions from '../redux/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Links from './Links';
import Search from './Search';
import RadioGroup from 'react-radio-group';

class Preferences extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      hasSubmitted: false,
      preference: this.props.preference
    }
  }

  handleSubmit() {
    this.props.actions.submitPreference(this.state.preference)
    this.setState({ hasSubmitted: true })
  }

  handleChange(value) {
    this.setState({ preference: value })
  }

  render() {
    return (
      <div>
        <h4>your current preference is: {this.props.preference}</h4>
        <RadioGroup
          name="preference"
          onChange={this.handleChange.bind(this)}
          selectedValue={this.state.preference}>
          {Radio => (
            <div>
              <Radio value="spotify"/>Spotify<br/>
              <Radio value="itunes"/>iTunes<br/>
              <Radio value="youtube"/>YouTube<br/>
              <Radio value="none"/>None<br/>
            </div>
          )}
        </RadioGroup>
        <button onClick={this.handleSubmit.bind(this)}>update preferences</button>
        <div>{this.props.loading.preference ? 'updating preference...' : this.state.hasSubmitted ? 'updated successfully' : ' '}</div>
      </div>
    )
  }

}

Preferences.propTypes = {
  loading: PropTypes.object.isRequired,
  preference: PropTypes.string.isRequired
}

function mapStateToProps(state) {
  return {
    loading: state.loading,
    preference: state.preference
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
