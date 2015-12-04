import React from 'react'

var Result = React.createClass({

  render: function() {
    return <li>{this.props.result.title} - {this.props.result.artist} <img src={this.props.result.artwork} height='30px'></img></li>
  }

});

module.exports = Result;
