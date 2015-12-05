import React from 'react'

var Result = React.createClass({

  handleClick: function () {
    this.props.createLink(this.props.result.artwork);
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
