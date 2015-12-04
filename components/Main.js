import React from 'react';
import * as actions from '../redux/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Links from './Links';
import Search from './Search';

var Main = React.createClass({

  render: function() {
    return (
      <div>
        <Search 
          actions={this.props.actions}
          loading={this.props.loading}
          results={this.props.results}/>
        <Links 
          links={this.props.links}
          loading={this.props.loading}/>
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(Main);
