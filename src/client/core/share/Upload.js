/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var IconButton = require('../element/IconButton');
var Path = require('../element/Path');

var I18nMixin = require('../i18n/I18nMixin');

var Upload = React.createClass({
	
	mixins: [
		I18nMixin
	],

	statics: {
		isInStatusGroup: function (group, status) {
			var uploadStatus = {
				neutral: ['RATIFYING_REQUEST', 'UPLOAD_STARTED']
			};
			
			return uploadStatus[group].indexOf(status) !== -1;
		}
	},

	getDefaultProps: function () {
		return {
			id: '',
			name: '',
			path: '',
			status: '',
			onCancel: function () {
			},
			onRemove: function () {
			},
			onShow: function () {
			}
		};
	},

	cancelUpload: function () {
		this.props.onCancel(this.props.id);
	},

	render: function () {
		/*if (!this.type.isInStatusGroup('neutral', this.props.status)) {
			return (<span className='hidden'></span>);
		}*/
		return (
			<div className={'upload animated fadeIn'}>
				<h3>{this.props.name}</h3>
				<Path path={this.props.path} />

				<div className='progress'></div>
					
				<div className='action-buttons'>
					<IconButton icon='close' onClick={this.cancelUpload} tooltipContent={this.i18n('upload_cancelButton_tooltipContent')} />
				</div>
			</div>
		)
	}

});

module.exports = Upload;