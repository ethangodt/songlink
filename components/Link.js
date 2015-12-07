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
    if (navigator.appVersion.indexOf("Win") !=-1 ) {
      return 'control + C'
    } else {
      return 'command + C'
    }
  }

  render() {
    return (
      <div>

        <input 
          type="text"
          value={this.props.link}
          ref={this.props.index === 0 && !this.state.inputHasLoaded ? 
            this.handleFocusOnLoad.bind(this) : undefined}
          onFocus={this.handleFocus.bind(this)}/>

        <span> {this.getCorrectCopyShortcut()} to copy link</span>

      </div>
    )
  }

}

Link.propTypes = {
  index: PropTypes.number.isRequired,
  link: PropTypes.string.isRequired
}

export default Link
