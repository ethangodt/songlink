import React, { Component, PropTypes } from 'react'

class Result extends Component {

  handleClick() {
    window.scrollTo(0, 0);
    this.props.actions.createLink(this.props.result)
    this.props.actions.clearResults()
    this.props.clearText()
  }

  render() {
    return (
      <div className="result" onMouseDown={this.handleClick.bind(this)}>
        <div className="result-art">
          <img src={this.props.result.album_art}></img>
        </div>
        <div className="result-info">
          <div className="result-info-item title">{this.props.result.title}</div>
          <div className="result-info-item artist">{this.props.result.artist} </div>
          <div className="result-info-item album"> {this.props.result.album_title}</div>
        </div>
      </div>
    )
  }

}

Result.propTypes = {
  actions: PropTypes.object.isRequired,
  clearText: PropTypes.func.isRequired,
  result: PropTypes.object.isRequired
}

export default Result
