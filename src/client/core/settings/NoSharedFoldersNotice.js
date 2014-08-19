/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var Badge = require('../element/Badge');
var SvgIcon = require('../element/SvgIcon');

var NoSharedFoldersNotice = React.createClass({

	getDefaultProps: function () {
		return {
			title: '',
			description: '',
			icon: 'folder'
		}
	},

	render: function () {
		return (
			<div className='no-shared-folders-notice-wrapper'>
				<div className='no-shared-folders-notice'>
					<div className='icon-wrapper'>
						<SvgIcon icon={this.props.icon} />
						<Badge label='0' className='status-invalid' />
					</div>
					<div className='content'>
						<h2>{this.props.title}</h2>
						<p>{this.props.description}</p>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = NoSharedFoldersNotice;