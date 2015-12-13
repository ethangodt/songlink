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
      <div className="result" onClick={this.handleClick.bind(this)}>
        <img src={this.props.result.album_art} height="100px" width="100px"></img>
        <ul className="resultItem">
          <li className="resultTitle">{this.props.result.title}</li>
          <li className="resultArtist">{this.props.result.artist} </li>
          <li className="resultAlbum"> {this.props.result.album_title}</li>
        </ul>
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
