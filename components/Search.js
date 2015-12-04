import React from 'react';
import * as actions from '../redux/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Results from './Results';

var Search = React.createClass({

  updateSearch: function(val) {
    this.props.actions.search(val);
  },

  handleChange: function (e) {
    this.setState({
      text: e.target.value
    }, function () {
      if (this.state.text.length > 3) {
        this.updateSearch(e.target.value);
      } else if (!this.state.text.length) {
        this.props.actions.clearResults();
      }
    });
  },

  getInitialState: function () {
    return {
      text: ''
    };
  },

  render: function () {

    return (
      <div>
        <form>
          <input
            type="text"
            placeholder="Search for song"
            autoFocus="true"
            value={this.state.text}
            onChange={this.handleChange}/>
        </form>

        <Results 
          loading={this.props.loading}
          results={this.props.results}
          createLink={this.props.actions.createLink}/>

      </div>
    )
  }
});

module.exports = Search;
