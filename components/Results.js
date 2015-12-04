import React from 'react';
import Result from './Result';

var Results = React.createClass({

  render: function() {
    return (
      <div>
        <h4>Results:</h4>
        {this.props.loading.search ? <div>results are loading...</div> : <div><br/></div>}
        <ul>
          {
            this.props.results.map(function (result, i) {
              return <Result key={i} title={result} createLink={this.props.createLink}/>;
            }.bind(this))
          }
        </ul>        
      </div>
    )
  }

});

module.exports = Results;
