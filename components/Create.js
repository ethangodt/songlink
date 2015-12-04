import React from 'react';
import * as actions from '../redux/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

var Create = React.createClass({

  handleSubmit: function (e) {
    e.preventDefault();
    this.props.search(this.state.text);
    this.setState({
      text: ''
    });
  },

  updateSearch: function(val) {
    this.props.search(val);
  },

  handleChange: function (e) {
    this.setState({
      text: e.target.value
    });
    this.updateSearch(e.target.value);
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

      </div>
    )
  }
});

module.exports = Create;
