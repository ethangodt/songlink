import React from 'react';
import * as actions from '../redux/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Results from './Results';

var Create = React.createClass({

  handleSubmit: function (e) {
    e.preventDefault();
    this.props.actions.search(this.state.text);
    this.setState({
      text: ''
    });
  },

  handleChange: function (e) {
    this.setState({
      text: e.target.value
    });
  },

  getInitialState: function () {
    return {
      text: ''
    };
  },

  render: function() {

    return (
      <div>

        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Search for song"
            autoFocus="true"
            value={this.state.text}
            onChange={this.handleChange} />
          <input 
            type="submit"
            value="Search" />
        </form>

        <Results results={this.props.results}/>

      </div>
    )
  }
});

var mapStateToProps = function (state) {
  return state;
};

var mapDispatchToProps = function (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Create);
