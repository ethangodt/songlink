import React, { Component, PropTypes } from 'react';
import * as actions from '../redux/actions'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Results from './Results'

const elapsedTimeAfterKeyStroke = 450;

class Search extends Component {

  constructor(props, context) {
    super(props, context);
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

    const link = this.getLinkInfo(e.target.value);
    const last = e.target.value && !link ? Date.now() : undefined;

    this.setState({
      text: e.target.value,
      last: last,
      link: link
    }, () => {

      if (!this.state.text.length || link) {
        this.props.actions.toggleLoadingSearch(false);
        return this.props.actions.clearResults()
      }

      if (!this.state.link) {
        this.props.actions.toggleLoadingSearch(true);
        return setTimeout(this.updateSearch.bind(this), elapsedTimeAfterKeyStroke)
      }

    })

  }

  isInvalid() {
    return this.state.link && this.state.link.id in this.props.invalidLinks
  }

  getLinkInfo(text) {
    const itunesTrackLink = /^https:\/\/itun.es\/[a-z]+\/[\w-]+\?i=([\d]+)$/;
    const spotifyTrackLink = /^https:\/\/open.spotify.com\/[\w]+\/([\w\d]+)$/;
    const spotifyUri = /^spotify:track:([\w\d-]+)$/;
    var id;

    if (itunesTrackLink.test(text)) {
      id = itunesTrackLink.exec(text)[1];
      return {service: 'itunes', id: id};
    } else if (spotifyTrackLink.test(text)) {
      id = spotifyTrackLink.exec(text)[1];
      return {service: 'spotify', id: id};
    } else if (spotifyUri.test(text)) {
      id = spotifyUri.exec(text)[1];
      return {service: 'spotify', id: id};
    } else {
      return undefined;
    }
  }

  handleFocus(e) {
    if (this.state.text.length && !this.state.link) {
      this.props.actions.search(this.state.text)
    }
  }

  handleBlur(e) {
    e.preventDefault();
    this.props.actions.clearResults()
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.isInvalid()) {
      let song = {};
      song[ this.state.link.service + '_id' ] = this.state.link.id;
      this.props.actions.createLink(song, this.state.link.id)
    } else {
      if (this.state.text.length) this.props.actions.search(this.state.text)
    }
  }

  handleKeyUp(e) {
    e.preventDefault();
    if (e.keyCode === 13) {
      this.handleSubmit(e)
    } else if (e.keyCode === 8 && this.state.text === '') {
      this.props.actions.clearResults()
    }
  }

  getButtonClasses() {

    if (this.props.loading.search || this.props.loading.link) {
      return classnames('fa', 'fa-spinner', 'fa-spin')
    }

    if (this.state.link && !this.props.loading.link) {
      return classnames('fa', 'fa-sign-in')
    }

    return classnames('fa', 'fa-search')
  }

  renderLinkInformation() {
    return (
      <div className="search-information invalid">
        <span className="fa fa-warning"></span>
        <span> invalid link url</span>
      </div>
    )
  }

  renderNoResults() {
    return (
      <div className="search-information no-results">
        <span className="fa fa-warning"></span>
        <span> no results found</span>
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

          <button onClick={this.handleSubmit.bind(this)}>
            <span className={this.getButtonClasses()}></span>
          </button>

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

          <Results
            style={ this.props.results ? {} : {display: 'none'} }
            loading={this.props.loading}
            results={this.state.last ? this.props.results : []}
            actions={this.props.actions}
            clearText={this.clearText.bind(this)}/>

        </div>

        { this.isInvalid() ? this.renderLinkInformation() : undefined }

        { this.state.text.length && !this.props.loading.search && !this.props.results.length && !this.state.link ?
          this.renderNoResults() : undefined }

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
