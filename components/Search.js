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
      text: '',
      last: Date.now()
    }
  }

  clearText() {
    this.setState({
      text: ''
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
      } else {
        setTimeout(this.updateSearch.bind(this), elapsedTimeAfterKeyStroke)
      }
    })

  }

  handleFocus(e) {
    if (this.state.text.length) {
      this.props.actions.search(this.state.text)
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.actions.search(this.state.text)
  }

  render() {
    return (
      <div>

        <div>{this.props.loading.search ? 'loading...' : 'SEARCH'}</div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input
            type="text"
            placeholder="Search for song"
            autoFocus="true"
            value={this.state.text}
            onChange={this.handleChange.bind(this)}
            onFocus={this.handleFocus.bind(this)}/>
          <input
            type="submit"
            value="Search"/>
        </form>

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
