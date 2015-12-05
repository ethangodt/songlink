import React from 'react';
import Link from './Link';

var Links = React.createClass({

  render: function() {
    return (
      <div>
        <h4>Links:</h4>
        {this.props.loading.link ? <div>new link loading...</div> : <div><br/></div>} 
        <ul>
          {
            this.props.links.map(function (link, i) {
              return <Link key={i} index={i} link={link}/>;
            })
          }
        </ul>       
      </div>
    )
  }

});

module.exports = Links;
