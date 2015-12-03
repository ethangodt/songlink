import React from 'react';
import Result from './Result';

var Results = React.createClass({

  render: function() {
    return (
      <ul>
      {
        this.props.results.map(function (result, i) {
          return <Result key={i} result={result}/>;
        })
      }
      </ul>
    )
  }

});

module.exports = Results;
