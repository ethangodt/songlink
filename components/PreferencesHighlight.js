import React, { Component } from 'react'
import { Link } from 'react-router'

class PreferencesHighlight extends Component {

	render() {
		return (
			<div className="preferencesHighlightContainer">
				<div className="contentWrapper">
					<Link to="/preferences">
						<span>
							<span className="fa fa-cog"></span>
							<span>Change your <span id="preferenceHighlight">preferences</span> so that songlinks open automatically in your music app of choice</span>
							<span className="hoverArrow">></span>
						</span>
					</Link>
				</div>
			</div>
		)
	}

}

export default PreferencesHighlight
