import React, { Component, PropTypes } from 'react';
import * as actions from '../redux/actions'
import classnames from 'classnames'
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

  isInvalid() {
    return this.state.link && this.state.link.id in this.props.invalidLinks
  }

  getLinkInfo(text) {
    if (text.slice(0,4) === "http") {
      if (text.includes("itun.es")) {
        const arr = text.split('=')
        const id = arr[arr.length - 1]
        return { service: 'itunes', id: arr[arr.length - 1] }
      } else if (text.includes("spotify")) {
        const arr = text.split('/')
        const id = arr[arr.length - 1]
        return { service: 'spotify', id: id }
      }
    } else if (text.slice(0,8) === "spotify:") {
      const arr = text.split(':')
      const id = arr[arr.length - 1]
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
    if (!this.isInvalid()) {
      let song = {}
      song[ this.state.link.service + '_id' ] = this.state.link.id
      this.props.actions.createLink(song, this.state.link.id)
    } else {
      if (this.state.text.length) this.props.actions.search(this.state.text)
    }
  }

  handleKeyUp(e) {
    e.preventDefault()
    if (e.keyCode === 13) {
      this.handleSubmit(e)
    }
  }

  getButtonClasses() {
    if (this.props.loading.search || this.props.loading.link) {
      return classnames('fa', 'fa-spinner', 'fa-spin')
    } else {
      return classnames({
        'fa': true,
        'fa-search': !this.state.link,
        'fa-sign-in': this.state.link
      })
    }
  }

  renderLinkInformation() {
    return (
      <div className="link-information">
        <span className="fa fa-warning"></span> 
        <span> invalid link url</span>
      </div>
    )
  }

  render() {

    return (
      <div className="search">

        <div 
          className={classnames({
            'search-bar': true,
            'is-invalid': this.isInvalid()
          })}>

          <input
            className={classnames({
              'is-invalid': this.isInvalid()
            })}
            type="text"
            placeholder={this.props.loading.link ? "Creating link..." : "Search or paste song URL"}
            autoFocus="true"
            value={this.state.text}
            onChange={this.handleChange.bind(this)}
            onFocus={this.handleFocus.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            onKeyUp={this.handleKeyUp.bind(this)}/>

          <button onClick={this.handleSubmit.bind(this)}>
            <span className={this.getButtonClasses()}></span>
          </button>

          <Results
            style={ this.props.results ? {} : {display: 'none'} }
            loading={this.props.loading}
            results={this.props.results}
            actions={this.props.actions}
            clearText={this.clearText.bind(this)}/>

        </div>

        { this.isInvalid() ? this.renderLinkInformation() : undefined }

      </div>
    )
  }

}

Search.propTypes = {
  actions: PropTypes.object.isRequired,
  invalidLinks: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  results: PropTypes.array.isRequired
}

export default Search;
