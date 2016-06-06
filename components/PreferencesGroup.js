import React, { Component } from 'react'
import classnames from 'classnames'

class PreferencesGroup extends Component {

	render() {
		return (
				<div className="preferences-group">
					
					<div
						className={classnames({
							'radio': true,
							'spotify': true,
							'selected': this.props.selected === 'spotify'
						})}
						onClick={this.props.handleClick}
					>
						<span className="fa fa-spotify spotify"></span><span className="spotify">Spotify</span><br/>
					</div>

					<div
						className={classnames({
							'radio': true,
							'itunes': true,
							'selected': this.props.selected === 'itunes'
						})}
						onClick={this.props.handleClick}
					>
						<span className="fa fa-apple itunes"></span><span className="itunes">iTunes</span><br/>
					</div>

					<div
						className={classnames({
							'radio': true,
							'google': true,
							'selected': this.props.selected === 'google'
						})}
						onClick={this.props.handleClick}
					>
						<span className="fa fa-google google"></span><span className="google">Google Play Music</span><br/>
					</div>

					<div
						className={classnames({
							'radio': true,
							'youtube': true,
							'selected': this.props.selected === 'youtube'
						})}
						onClick={this.props.handleClick}
					>
						<span className="fa fa-youtube-play youtube"></span><span className="youtube">YouTube</span><br/>
					</div>

					<div
						className={classnames({
							'radio': true,
							'deezer': true,
							'selected': this.props.selected === 'deezer'
						})}
						onClick={this.props.handleClick}
					>
						<span className="fa fa-play-circle-o"></span><span className="deezer">Deezer</span><br/>
					</div>

					<div
						className={classnames({
							'radio': true,
							'none': true,
							'selected': this.props.selected === 'none'
						})}
						onClick={this.props.handleClick}
					>
						<span className="none">No auto redirect preference</span>
					</div>
				</div>
		)
	}

}

export default PreferencesGroup
