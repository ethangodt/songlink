import React from 'react'
import * as actions from '../redux/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

var App = React.createClass({

  render: function() {
    return (
      <div>
        <h3>begin header</h3>
        <Link to="/">go to home/create</Link><br/>
        <Link to="/song/1">go to song with id 1</Link>
        <h3>end header</h3>
        <br/>
        <br/>
        {this.props.children}
      </div>
    )
  }

});

module.exports = App;
