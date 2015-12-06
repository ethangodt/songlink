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
                clearText={this.props.clearText}
                actions={this.props.actions}/>
          )})
        }
      </ul>
    ) 
  }

}

Results.propTypes = {
  results: PropTypes.array.isRequired
}

export default Results
