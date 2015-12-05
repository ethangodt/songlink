import React from 'react';
import Result from './Result';

var Results = React.createClass({

  render: function() {
    return this.renderResultsOrLoading();
  },

  renderResultsOrLoading: function () {
    if (this.props.loading.search) {
      return <div>results are loading...</div>
    } else {
      return (
        <ul>
          {
            this.props.results.map(function (result, i) {
              return <Result key={i} result={result} actions={this.props.actions}/>;
            }.bind(this))
          }
        </ul>
      )
    }
  }

});

module.exports = Results;
