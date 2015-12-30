import React, { Component, PropTypes } from 'react'
import { FacebookButton, TwitterButton, GooglePlusButton, RedditButton, EmailButton } from 'react-social'
import classnames from 'classnames'
import ClipboardButton from 'react-clipboard.js'
import ReactTooltip from 'react-tooltip'

class Link extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      copied: false,
      inputHasLoaded: false,
      isSafari: Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0
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
    if (!this.state.isSafari) {
      return !this.state.copied ? 'Copy link' : 'Copied!'
    }
    return 'Please copy manually'
  }

  handleCopyClick() {
    if (!this.state.isSafari) {
      this.setState({ copied: true })
    }
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
            data-for={''+this.props.index}>
            <ClipboardButton className="copy" data-clipboard-text={this.props.link.url}>
              <span className={classnames({
                'fa': true,
                'fa-link': true,
                'inactive': this.state.isSafari
              })}></span>
            </ClipboardButton>
          </a>
          <ReactTooltip id={''+this.props.index}>
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
            <span>Share on Facebook</span>
          </ReactTooltip>

          <a data-tip data-for="twitter">
            <TwitterButton className="twitter" url={this.props.link.url} message={this.createSocialMessage()}>
              <span className="fa fa-twitter"></span>
            </TwitterButton>
          </a>
          <ReactTooltip id="twitter">
            <span>Share on Twitter</span>
          </ReactTooltip>

          <a data-tip data-for="google-plus">
            <GooglePlusButton className="google-plus" url={this.props.link.url}>
              <span className="fa fa-google-plus"></span>
            </GooglePlusButton>
          </a>
          <ReactTooltip id="google-plus">
            <span>Share on Google+</span>
          </ReactTooltip>

          <a data-tip data-for="reddit">
            <RedditButton className="reddit" url={this.props.link.url}>
              <span className="fa fa-reddit-alien"></span>
            </RedditButton>
          </a>
          <ReactTooltip id="reddit">
            <span>Share on reddit</span>
          </ReactTooltip>

          <a data-tip data-for="email">
            <EmailButton className="email" url={this.props.link.url} message={this.createSocialMessage()}>
              <span className="fa fa-envelope"></span>
            </EmailButton>
          </a>
          <ReactTooltip id="email">
            <span>Share via email</span>
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
