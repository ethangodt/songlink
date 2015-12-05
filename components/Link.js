import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard';

var Link = React.createClass({

  handleFocus: function (e) {
    e.target.select();
  },

  handleFocusOnLoad: function (el) {
    el.select();
  },

  render: function() {
    return (
      <div>

        <input 
          type="text"
          value={this.props.link}
          ref={!this.props.index ? this.handleFocusOnLoad : undefined}
          onFocus={this.handleFocus}/>

        <CopyToClipboard text={this.props.link}>
          <button>Copy to clipboard</button>
        </CopyToClipboard>

      </div>
    )
  }

});

module.exports = Link;
