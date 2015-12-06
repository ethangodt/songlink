import React, { Component, PropTypes } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

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
      <div>

        <input 
          type="text"
          value={this.props.link}
          ref={this.props.index === 0 && !this.state.inputHasLoaded ? 
            this.handleFocusOnLoad.bind(this) : undefined}
          onFocus={this.handleFocus.bind(this)}/>

        <CopyToClipboard text={this.props.link}>
          <button>Copy to clipboard</button>
        </CopyToClipboard>

      </div>
    )
  }

}

Link.propTypes = {
  index: PropTypes.number.isRequired,
  link: PropTypes.string.isRequired
}

export default Link
