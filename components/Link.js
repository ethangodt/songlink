import React, { Component, PropTypes } from 'react'
import { FacebookButton, TwitterButton } from 'react-social'
import ClipboardButton from 'react-clipboard.js'
import ReactTooltip from 'react-tooltip'

class Link extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      copied: false,
      inputHasLoaded: false
    }
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

  createSocialMessage() {
    return 'Listen to ' + this.props.link.title + ' by ' + this.props.link.artist + ' '
  }

  renderCopyTooltipText() {
    return this.state.copied ? 'copied!' : 'copy link'
  }

  handleCopyClick() {
    this.setState({ copied: true })
  }

  handleCopyMouseLeave() {
    this.setState({ copied: false })
  }

  render() {
    return (
      <div className="link">

        <div className="link-header">
          <img src={this.props.link.album_art}></img>
          <div className="link-info">
            <span className="title">{this.props.link.title}</span><br/>
            <span className="artist">{this.props.link.artist}</span><br/>
            <span className="album">{this.props.link.album_title}</span>
          </div>
        </div>

        <div className="link-container">

          <input 
            type="text"
            value={this.props.link.url}
            ref={this.props.index === 0 && !this.state.inputHasLoaded ? 
              this.handleFocusOnLoad.bind(this) : undefined}
            onFocus={this.handleFocus.bind(this)}/>

          <a 
            onClick={this.handleCopyClick.bind(this)}
            onMouseLeave={this.handleCopyMouseLeave.bind(this)}
            data-tip
            data-for="copy">
            <ClipboardButton className="copy" data-clipboard-text={this.props.link.url}>
              <span className="fa fa-link"></span>
            </ClipboardButton>
          </a>
          <ReactTooltip id="copy">
            <span>{this.renderCopyTooltipText()}</span>
          </ReactTooltip>

        </div>

        <div className="button-container">

          <a data-tip data-for="facebook">
            <FacebookButton className="facebook" url={this.props.link.url} message={this.createSocialMessage()}>
              <span className="fa fa-facebook"></span>
            </FacebookButton>
          </a>
          <ReactTooltip id="facebook">
            <span>share on Facebook</span>
          </ReactTooltip>

          <a data-tip data-for="twitter">
            <TwitterButton className="twitter" url={this.props.link.url} message={this.createSocialMessage()}>
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
