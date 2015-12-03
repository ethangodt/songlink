import React from 'react'

var Song = React.createClass({

  render: function() {
    return (
      <div>
        <div>this is the song page</div>
        <div>with an id: {this.props.params.id}</div>
      </div>  
    )  
  }

});

module.exports = Song;

