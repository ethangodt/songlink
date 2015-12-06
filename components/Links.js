import React, { Component, PropTypes } from 'react';
import Link from './Link';

class Links extends Component {

  render() {
    return (
      <div>
        <h4>LINKS</h4>
        <span>
          {this.props.loading.link ? 'new link loading...' : ''} 
        </span>
        <ul>
          {
            this.props.links.map((link, i) => {
              return <Link key={i} index={i} link={link}/>
            })
          }
        </ul>       
      </div>
    )
  }

}

Links.propTypes = {
  loading: PropTypes.object.isRequired,
  links: PropTypes.array.isRequired
}

export default Links
