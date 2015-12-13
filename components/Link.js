import React, { Component, PropTypes } from 'react'
import { FacebookButton, TwitterButton } from 'react-social'
import ClipboardButton from 'react-clipboard.js'

class Link extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = { inputHasLoaded: false }
  }

  handleFocus(e) {
    e.target.select()
  }

  handleFocusOnLoad(el) {
    if (!this.state.inputHasLoaded) {
      el.select()
    }  
    this.setState({ inputHasLoaded: true })
  }

  render() {
    return (
      <div className="link">

        <div className="link-header">
          <span className="emphasis">share </span>
          <span className="title">{this.props.link.title} </span> 
          by
          <span className="artist"> {this.props.link.artist} </span> 
        </div>

        <div className="link-container">

          <input 
            type="text"
            value={this.props.link.url}
            ref={this.props.index === 0 && !this.state.inputHasLoaded ? 
              this.handleFocusOnLoad.bind(this) : undefined}
            onFocus={this.handleFocus.bind(this)}/>

          <ClipboardButton className="copy" data-clipboard-text={this.props.link.url}>
            <span className="fa fa-clipboard"></span>
          </ClipboardButton>
     
          <FacebookButton className="facebook" url={this.props.link.url}>
            <span className="fa fa-facebook"></span>
          </FacebookButton>


          <TwitterButton className="twitter" url={this.props.link.url}>
            <span className="fa fa-twitter"></span>
          </TwitterButton>

        </div>

      </div>
    )
  }

}

Link.propTypes = {
  index: PropTypes.number.isRequired,
  link: PropTypes.object.isRequired
}

export default Link
