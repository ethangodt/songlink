import React, { Component, PropTypes } from 'react';
import * as actions from '../redux/actions';
import Links from './Links';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Search from './Search';
import Explanation from './Explanation';
import Promo from './Promo';

class Main extends Component {

  constructor(props, context) {
    super(props, context)
  }

  renderExplanation() {
    return this.props.results.length ||
      this.props.links.length ?
        undefined : <Explanation/>
  }

  render() {
    return (

      <div>
        <div className="wrapper">

          <Search
            actions={this.props.actions}
            invalidLinks={this.props.invalidLinks}
            loading={this.props.loading}
            links={this.props.links}
            results={this.props.results}/>

          { this.renderExplanation() }

          <Links
            links={this.props.links}
            loading={this.props.loading}/>

        </div>

        <Promo />
      </div>

    )
  }

}

Main.propTypes = {
  actions: PropTypes.object.isRequired,
  invalidLinks: PropTypes.object.isRequired,
  links: PropTypes.array.isRequired,
  loading: PropTypes.object.isRequired,
  results: PropTypes.array.isRequired
}

function mapStateToProps(state) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)
