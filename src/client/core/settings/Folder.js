/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Link = require('react-router-component').Link;
var Badge = require('../elements/Badge');
var Path = require('../elements/Path');
var IconButton = require('../elements/IconButton');

var Folder = React.createClass({
	getDefaultProps: function () {
		return {
			name: '',
			path: '',
			items: 0,
			status: 'idle',
			onRemove: function () {
			},
			onRefresh: function () {
			}
		}
	},

	getInitialState: function () {
		return {
			actionButtonHoverClassName: '',
			hoverClassName: ''
		}
	},

	getBadge: function () {
		var badge = (<div className='badge-wrapper'>
						<Badge label={this.props.items} />
					</div>);

		return this.props.status === 'active' ? badge : null;
	},

	onMouseEnter: function () {
		this.setState({
			hoverClassName: ' bg-hover',
			actionButtonHoverClassName: ' bg-active'
		});
	},

	onMouseLeave: function () {
		this.setState({
			hoverClassName: '',
			actionButtonHoverClassName: ''
		});
	},

	removeFolder: function (e) {
		this.props.onRemove(this.props.path);
	},

	refreshFolder: function (e) {
		this.props.onRefresh(this.props.path);
	},

	render: function () {
		var refreshButton;

		if (this.props.status !== 'active') {
			refreshButton = (<IconButton className='sync' onClick={this.refreshFolder} />)
		}

		return (
			<div className={'folder bg-border-light' + this.state.hoverClassName} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
				<i className={'bg-color-light status-' + this.props.status}></i>

				<section>
					<h3>{this.props.name}</h3>
					<Path path={this.props.path} color='dark' />
					
					{this.getBadge()}
				</section>

				<div className={'action-buttons' + this.state.actionButtonHoverClassName}>
					{refreshButton}
					<IconButton className='remove' onClick={this.removeFolder} />
				</div>
			</div>
		)
	}
});

module.exports = Folder;