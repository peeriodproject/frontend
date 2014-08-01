/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var Badge = require('../element/Badge');
var Path = require('../element/Path');
var IconButton = require('../element/IconButton');

var I18nMixin = require('../i18n/I18nMixin');

var Folder = React.createClass({

	_refreshTimeout: null,

	mixins: [
		I18nMixin
	],

	getDefaultProps: function () {
		return {
			name: '',
			path: '',
			items: 0,
			status: 'idle',
			refreshIndicatorDurationInMs: 500,
			onRemove: function () {
			},
			onRefresh: function () {
			},
			onShow: function () {
			}
		};
	},

	getInitialState: function () {
		return {
			refreshClassName: ''
		};
	},

	removeFolder: function (e) {
		this.props.onRemove(this.props.path);
	},

	refreshFolder: function (e) {
		var self = this;
		this.props.onRefresh(this.props.path);

		if (this._refreshTimeout) {
			clearTimeout(this._refreshTimeout);
		}

		this._refreshTimeout = setTimeout(function () {
			self.setState({
				refreshClassName: ''
			});
		}, this.props.refreshIndicatorDurationInMs);

		this.setState({
			refreshClassName: 'refreshing'
		});
	},

	showFolder: function (e) {
		this.props.onShow(this.props.path);
	},

	render: function () {
		var refreshButton;
		var showButton;

		if (this.props.status !== 'active') {
			refreshButton = (<IconButton 
				className={this.state.refreshClassName}
				icon='sync'
				onClick={this.refreshFolder}
				tooltipContent={this.i18n('folder_refreshButton_tooltipContent')} />)
		}
		else {
			showButton = (<IconButton icon='view' onClick={this.showFolder} tooltipContent={this.i18n('folder_showButton_tooltipContent')} />)
		}

		return (
			<div className='folder'>
				<h3>{this.props.name}</h3>
				<Path path={this.props.path} />
					
				<div className='badge-wrapper'>
					<Badge label={this.props.items} className={'status-' + this.props.status} />
				</div>

				<div className='action-buttons'>
					{showButton}
					{refreshButton}
					<IconButton icon='bin' onClick={this.removeFolder} tooltipContent={this.i18n('folder_removeButton_tooltipContent')} />
				</div>
			</div>
		)
	}
});

module.exports = Folder;