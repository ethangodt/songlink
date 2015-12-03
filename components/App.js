import React from 'react'
import * as actions from '../redux/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Create from './Create';
import Results from './Results';
import Header from './Header';

var App = React.createClass({

  render: function() {
    return (
      <div>
        <Header/>
        <Create search={this.props.actions.search}/>
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(App);
