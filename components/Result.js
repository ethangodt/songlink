import React from 'react'

var Result = React.createClass({

  handleClick: function () {
    this.props.actions.createLink(this.props.result);
    this.props.actions.clearResults();
  },

  render: function() {
    return (
      <li onClick={this.handleClick}>
        <div>{this.props.result.name}</div>
        <div>{this.props.result.artist}</div>
        <div>{this.props.result.album_name}</div>
        <img src={this.props.result.artwork} height='30px'></img>
      </li>
    )
  }

});

module.exports = Result;
