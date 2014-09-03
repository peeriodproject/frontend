/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');

var SvgIcon = require('../element/SvgIcon');

var ConnectionLostNotice = React.createClass({

	mixins: [
		I18nMixin
	],

	getDefaultProps: function () {
		return {
			connectionLostClassName: 'connection-lost',
			reloadDelayInSeconds: 5,
			reloadDelayUpdateInterval: 500
		};
	},

	getInitialState: function () {
		return {
			reconnecting: false,
			reloadInSeconds: -1
		};
	},

	componentDidMount: function () {
		var _this = this;

		this._reloadTimeout = null;

		if (!socket) {
			return;
		}

		/*socket.on('reconnect', function () {

			console.log('Reconnect attempt started');
		});*/

		socket.on('reconnecting', function (opts) {
			_this.setState({
				reconnecting: true
			});

			console.log('Reconnecting in %d ms', opts.timeout);
			console.log('This is attempt %d out of %d', opts.attempt, opts.retries);

			if (opts.attempt === opts.retries) {
				window.location.reload();
			}
		});

		socket.on('open', function () {
			if (_this.state.reconnecting) {
				_this.startReloadTimeout();
			}
		});
	},

	componentDidUpdate: function () {
		this.updateElementClassName(document.getElementsByTagName('body')[0]);
	},

	componentWillUnmount: function () {
		if (this._reloadTimeout) {
			clearTimeout(this._reloadTimeout);
			this._reloadTimeout = null;
		}
	},

	updateElementClassName: function (el) {
		var classNameIndex = el.className.indexOf(' ' + this.props.connectionLostClassName);

		if (this.state.reconnecting && classNameIndex === -1) {
			el.className += ' ' + this.props.connectionLostClassName;
		}
		else if (!this.state.reconnecting && classNameIndex !== -1) {
			el.className = el.className.replace(' ' + this.props.connectionLostClassName, '');
		}
	},

	startReloadTimeout: function () {
		var _this = this;

		if (!this.state.reloadTimestamp) {
			this.setState({
				reloadTimestamp: Math.round(Date.now() + (this.props.reloadDelayInSeconds * 1000)),
				reloadInSeconds: Math.round(this.props.reloadDelayInSeconds)
			});
		}

		this._reloadTimeout = setTimeout(function () {
			var now = Date.now();
			var remaining = _this.state.reloadTimestamp - now;

			this._reloadTimeout = null;

			if (remaining <= 0) {
				window.location.reload();
				return;
			}
			
			_this.setState({
				reloadInSeconds: Math.round(remaining / 1000)
			});

			_this.startReloadTimeout();
			
		}, this.props.reloadDelayUpdateInterval);
	},

	render: function () {
		if (!this.state.reconnecting) {
			return null;
		}

		var noticeContent = this.state.reloadInSeconds > -1 ? this.i18n('connectionLost_reloading_content', [this.state.reloadInSeconds]) : this.i18n('connectionLost_notice_content')

		return (
			<div className='connection-lost-notice-wrapper animated fadeIn'>
				<div className='connection-lost-notice'>
					<div className='connection-lost-notice-inner'>
						<div className='icon-wrapper'>
							<SvgIcon icon='logo' />
						</div>
						<div className='content'>
							<h2>{this.i18n('connectionLost_notice_title')}</h2>
							<p>{noticeContent}</p>
						</div>
					</div>
				</div>
			</div>
		)
	}

});

module.exports = ConnectionLostNotice;