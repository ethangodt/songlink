import React, { Component, PropTypes } from 'react';
import * as actions from '../redux/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Results from './Results'

const elapsedTimeAfterKeyStroke = 450;

class Search extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = { 
      text: '',
      last: Date.now()
    }
    console.log(this.state)
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
    })

    if (e.target.value === '') {
      this.props.actions.clearResults()
    } else {
      setTimeout(this.updateSearch.bind(this), elapsedTimeAfterKeyStroke)
    }
  }

  handleFocus(e) {
    if (this.state) {
      this.props.actions.search(this.state.text)
    }
  }

  handleSubmit(e) {
    e.preventDefault()
  }

  render() {
    return (
      <div>

        <form onSubmit={this.handleSubmit.bind(this)}>
          <input
            type="text"
            placeholder="Search for song"
            autoFocus="true"
            value={this.state.text}
            onChange={this.handleChange.bind(this)}
            onFocus={this.handleFocus.bind(this)}/>
          <label style={{display: this.props.loading.search ? 'inline' : 'none'}}>loading...</label>
        </form>

        <Results 
          loading={this.props.loading}
          results={this.props.results}
          actions={this.props.actions}/>

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
