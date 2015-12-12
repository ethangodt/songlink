import React, { Component, PropTypes } from 'react'

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

  getCorrectCopyShortcut() {
    if (navigator.appVersion.indexOf("Win") !== -1 ) {
      return 'ctrl+C'
    } else {
      return '\u2318+C to copy'
    }
  }

  render() {
    return (
      <div className="link">
        <div className="linkInfo">{this.props.link.title} by {this.props.link.artist}</div>
        <input 
          type="text"
          value={this.props.link.url}
          ref={this.props.index === 0 && !this.state.inputHasLoaded ? 
            this.handleFocusOnLoad.bind(this) : undefined}
          onFocus={this.handleFocus.bind(this)}/>

        <button className="copyInstruction">{this.getCorrectCopyShortcut()}</button>
        <button>fb</button>
        <button className="lastButton">tw</button>

      </div>
    )
  }

}

Link.propTypes = {
  index: PropTypes.number.isRequired,
  link: PropTypes.object.isRequired
}

export default Link
