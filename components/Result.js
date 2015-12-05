import React from 'react'

var Result = React.createClass({

  handleClick: function () {
    this.props.actions.createLink(this.props.result.artwork);
    this.props.actions.clearResults();
  },

  render: function() {
    return (
      <li onClick={this.handleClick}>
        {this.props.result.title} - {this.props.result.artist}
        <img src={this.props.result.artwork} height='30px'></img>
      </li>
    )
  }

});

module.exports = Result;
