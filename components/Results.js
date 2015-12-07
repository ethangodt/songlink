import React, { Component, PropTypes } from 'react'
import Result from './Result'

class Results extends Component {

  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <ul>
        {
          this.props.results.map((result, i) => {
            return (
              <Result 
                key={i} 
                result={result}
                actions={this.props.actions}
                clearText={this.props.clearText}/>
          )})
        }
      </ul>
    ) 
  }

}

Results.propTypes = {
  actions: PropTypes.object.isRequired,
  clearText: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired
}

export default Results
