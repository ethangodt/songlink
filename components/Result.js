import React, { Component, PropTypes } from 'react'

class Result extends Component {

  handleClick() {
    console.log('handle click called')
    this.props.actions.createLink(this.props.result)
    this.props.actions.clearResults()
    this.props.clearText()
  }

  render() {
    return (
      <li onClick={this.handleClick.bind(this)}>
        <span><img src={this.props.result.album_art} height='30px'></img></span>
        <span>{this.props.result.title}</span><br/>
        <span>{this.props.result.artist} </span>
        <span> {this.props.result.album}</span>
      </li>
    )
  }

}

Result.propTypes = {
  actions: PropTypes.object.isRequired,
  clearText: PropTypes.func.isRequired,
  result: PropTypes.object.isRequired
}

export default Result
