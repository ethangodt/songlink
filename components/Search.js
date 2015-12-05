import React from 'react';
import * as actions from '../redux/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Results from './Results';

const elapsedTime = 450;

var Search = React.createClass({

  updateSearch: function() {
    if (Date.now() - this.state.last >= elapsedTime) {
      this.props.actions.search(this.state.text);
    }
  },

  handleChange: function (e) {

    this.setState({
      text: e.target.value,
      last: Date.now()
    });

    if (e.target.value === '') {
      this.props.actions.clearResults();
    } else {
      setTimeout(this.updateSearch, elapsedTime);
    }

  },

  handleFocus: function (e) {
    if(this.state.text.length) {
      this.props.actions.search(this.state.text);
    }
  },

  getInitialState: function () {
    return {
      text: '',
      last: Date.now()
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
            onChange={this.handleChange}
            onFocus={this.handleFocus}/>
        </form>

        <Results 
          loading={this.props.loading}
          results={this.props.results}
          actions={this.props.actions}/>

      </div>
    )
  }
});

module.exports = Search;
