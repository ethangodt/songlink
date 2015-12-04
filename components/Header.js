import React from 'react';
import { Link } from 'react-router';

var Header = React.createClass({

  render: function() {
    return (
      <div>
        <h1>songl.ink</h1>
        <h4>
          <Link to="/">main</Link>
          <span> </span>
          <Link to="/preferences">preferences</Link>
        </h4>
      </div>
    )
  }

});

module.exports = Header;
