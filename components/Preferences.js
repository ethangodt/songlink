import React from 'react'
import * as actions from '../redux/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Links from './Links';
import Search from './Search';
import RadioGroup from 'react-radio-group';

var Preferences = React.createClass({

  handleSubmit: function () {
    this.props.actions.submitPreference(this.state.preference);
    this.setState({
      hasSubmitted: true
    });
  },

  handleChange: function (value) {
    this.setState({
      preference: value
    });
  },

  getInitialState: function () {
    return {
      hasSubmitted: false,
      preference: this.props.preference
    }
  },

  render: function() {
    return (
      <div>
        <h4>your current preference is: {this.props.preference}</h4>
        <RadioGroup
          name="preference"
          onChange={this.handleChange}
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
        <button onClick={this.handleSubmit}>update preferences</button>
        <div>{this.props.loading.preference ? 'updating preference...' : this.state.hasSubmitted ? 'updated successfully' : ' '}</div>
      </div>
    )
  }

});

var mapStateToProps = function (state) {
  return {
    loading: state.loading,
    preference: state.preference
  };
};

var mapDispatchToProps = function (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Preferences);
