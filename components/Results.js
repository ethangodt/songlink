import React from 'react'

var Results = React.createClass({

  render: function() {
    return <div>search results: {this.props.results}</div>
  }

});

module.exports = Results;
