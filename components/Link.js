import React, { Component, PropTypes } from 'react'
import { FacebookButton, TwitterButton } from 'react-social'
import ClipboardButton from 'react-clipboard.js'
import ReactTooltip from 'react-tooltip'

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
          <img src="https://i.scdn.co/image/618eb67cdb1ab203e051d3b028a5b5f7b35325a1"></img>
          <div className="link-info">
            <span className="title">{this.props.link.title}</span><br/>
            <span className="artist">{this.props.link.artist}</span><br/>
            <span className="album">Awesome Album Title</span>
          </div>
        </div>

        <div className="link-container">

          <input 
            type="text"
            value={this.props.link.url}
            ref={this.props.index === 0 && !this.state.inputHasLoaded ? 
              this.handleFocusOnLoad.bind(this) : undefined}
            onFocus={this.handleFocus.bind(this)}/>

        </div>

        <div className="button-container">

          <a data-tip data-for="copy">
            <ClipboardButton className="copy" data-clipboard-text={this.props.link.url}>
              <span className="fa fa-clipboard"></span>
            </ClipboardButton>
          </a>
          <ReactTooltip id="copy">
            <span>copy link</span>
          </ReactTooltip>

          <a data-tip data-for="facebook">
            <FacebookButton className="facebook" url={this.props.link.url}>
              <span className="fa fa-facebook"></span>
            </FacebookButton>
          </a>
          <ReactTooltip id="facebook">
            <span>share on Facebook</span>
          </ReactTooltip>

          <a data-tip data-for="twitter">
            <TwitterButton className="twitter" url={this.props.link.url}>
              <span className="fa fa-twitter"></span>
            </TwitterButton>
          </a>
          <ReactTooltip id="twitter">
            <span>share on Twitter</span>
          </ReactTooltip>

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
