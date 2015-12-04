import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard';

var Link = React.createClass({

  render: function() {
    return (
      <div>
        <input type="text" value={this.props.link}/>
        <CopyToClipboard text={this.props.link}>
          <button>Copy to clipboard</button>
        </CopyToClipboard>
      </div>
    )
  }

});

module.exports = Link;
