import React, { Component, PropTypes } from 'react';
import * as actions from '../redux/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Results from './Results'

const elapsedTimeAfterKeyStroke = 450;

class Search extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = { 
      last: Date.now(),
      text: '',
      link: undefined
    }
  }

  clearText() {
    this.setState({
      text: '',
      link: undefined
    })
  }

  updateSearch() {
    if (Date.now() - this.state.last >= elapsedTimeAfterKeyStroke) {
      this.props.actions.search(this.state.text)
    }
  }

  handleChange(e) {

    this.setState({
      text: e.target.value,
      last: Date.now()
    }, () => {
      if (this.state.text === '') {
        this.props.actions.clearResults()
        this.setState({ link: undefined })
      } else {
        const link = this.getLinkInfo(this.state.text)
        if (!link) {
          this.setState({ link: undefined })
          setTimeout(this.updateSearch.bind(this), elapsedTimeAfterKeyStroke)
        } else {
          this.props.actions.clearResults()
          this.setState({ link: link })
        }
      }
    })

  }

  getLinkInfo(text) {
    if (text.slice(0,4) === "http") {
      if (text.includes("itun.es")) {
        const arr = text.split('=')
        return { service: 'itunes', id: arr[arr.length - 1] }
      } else if (text.includes("spotify")) {
        const arr = text.split('/')
        return { service: 'spotify', id: arr[arr.length - 1] }
      }
    } else if (text.slice(0,8) === "spotify:") {
      const arr = text.split(':')
      return {service: 'spotify', id: arr[arr.length - 1] }
    }
    return undefined
  }

  handleFocus(e) {
    if (this.state.text.length && !this.state.link) {
      this.props.actions.search(this.state.text)
    }
  }

  handleBlur(e) {
    e.preventDefault()
    this.props.actions.clearResults()
  } 

  handleSubmit(e) {
    e.preventDefault()
    if (this.state.link) {
      let song = {}
      song[ this.state.link.service + '_id' ] = this.state.link.id
      this.props.actions.createLink(song)
    } else {
      this.props.actions.search(this.state.text)
    }
  }

  render() {

    return (
      <div className="searchContainer">

        <div>{this.state.link ? this.state.link.service + ' link detected' : ' '}</div>

        <div style={ {position: 'relative'} }>
          
          <input
            type="text"
            placeholder="Search for song"
            autoFocus="true"
            value={this.state.text}
            onChange={this.handleChange.bind(this)}
            onFocus={this.handleFocus.bind(this)}/>
          <button onClick={this.handleSubmit.bind(this)}>
            { this.state.link ? 'create' : 'search' }
          </button>

        </div>

        <Results
          loading={this.props.loading}
          results={this.props.results}
          actions={this.props.actions}
          clearText={this.clearText.bind(this)}/>

      </div>
    )
  }

}

Search.propTypes = {
  actions: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  results: PropTypes.array.isRequired
}

export default Search;
