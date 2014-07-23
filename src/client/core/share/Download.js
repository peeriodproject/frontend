/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var countdown = require('countdown');

var Download = React.createClass({

	_updateTimeout: null,

	getDefaultProps: function () {
		return {
			created		: 0,
			id			: '',
			loaded		: 0,
			name		: '',
			size		: 0,
			status		: '',
			progress	: Math.random() * 100
		};
	},

	getInitialState: function () {
		return {
			averageSpeed: 0,
			now: 0,
			timeLeft: 0
		};
	},

	componentDidMount: function () {
		this.calcTimeAndSpeed();

		this._startUpdateTimeout();
	},
	// @see http://stackoverflow.com/a/7312237
	componentWillReceiveProps: function (nextProps) {
		this.calcTimeAndSpeed(nextProps);
	},

	_startUpdateTimeout: function () {
		var _this = this;

		if (this._updateTimeout) {
			clearTimeout(this._updateTimeout);
		}

		this._updateTimeout = setTimeout(function () {
			_this.calcTimeAndSpeed();
			_this._startUpdateTimeout();
		}, 200);
	},

	/**
	 * Returns the progress as a decimal value 0 <= i <= 1
	 *
	 * @returns {number} the state of the download progress
	 */
	getProgress: function () {
		var prog = (this.props.loaded / this.props.size);

		return prog;
	},

	/**
	 * Returns the given size in a human readable format
	 *
	 * @param  {number} bytes The number of bytes
	 *
	 * @return {string}       The formatted size with extension
	 */
	getSizeWithExtension: function (bytes) {
		if (bytes === 0) {
			return '0 Byte';
		}

		var k = 1024;
		var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		var i = Math.floor(Math.log(bytes) / Math.log(k));

		return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
	},

	calcTimeAndSpeed: function (props) {
		props = props || this.props;

		var now = new Date().getTime();
		var timeElapsed = now - this.props.created;
		var speed = this.props.loaded / timeElapsed;
		var timeLeft = (this.props.size - this.props.loaded) / speed;

		this.setState({
			timeLeft: timeLeft,
			now: now,
			averageSpeed: this.getAverageSpeed(speed * 1000) // ms to s
		});
	},

	// @see http://stackoverflow.com/a/3841706
	getAverageSpeed: function (lastSpeed) {
		var SMOOTHING_FACTOR = 0.45;
		
		// exponential moving average
		return SMOOTHING_FACTOR * lastSpeed + (1 - SMOOTHING_FACTOR) * this.state.averageSpeed;
	},

	getTimeLeft: function () {
		return countdown(new Date().getTime() + this.state.timeLeft).toString();
	},

	render: function () {
		if (!this.props.status) {
			return null;
		}

		return (
			<div className='download'>
				<header>
					{this.props.name}
				</header>
				
				<progress value={this.getProgress() * 100} max='100'></progress>

				<span className='size'>
					{this.getSizeWithExtension(this.props.loaded)} of {this.getSizeWithExtension(this.props.size)}
				</span>
				<span className='speed'>{this.getSizeWithExtension(this.state.averageSpeed)}/s</span>
				<span className='time'>{this.getTimeLeft()}</span>
			</div>
		)
	}

});

module.exports = Download;