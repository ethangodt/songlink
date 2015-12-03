import React from 'react'

var Result = React.createClass({

  render: function() {
    return <li>{this.props.result}</li>
  }

});

module.exports = Result;
