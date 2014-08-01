/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var Badge = require('../element/Badge');
var IconButton = require('../element/IconButton');
var SvgIcon = require('../element/SvgIcon');

var DownloadMixin = require('./DownloadMixin');
var I18nMixin = require('../i18n/I18nMixin');

var Download = React.createClass({
	
	mixins: [
		DownloadMixin,
		I18nMixin
	],

	_downloadStatus: {
		valid: ['COMPLETED'],
		neutral: ['REQUESTING_FILE', 'TRANSFER_STARTED', 'MANUAL_ABORT'],
		invalid: ['FS_ERROR', 'REMOTE_ABORT', 'TIMED_OUT', 'PROTOCOL_ERR']
	},

	getDefaultProps: function () {
		return {
			onCancel: function () {
			},
			onRemove: function () {
			},
			onShow: function () {
			}
		};
	},

	isInStatusGroup: function (group, status) {
		return this._downloadStatus[group].indexOf(status) !== -1;
	},

	getStatusIcon: function () {
		var status = this.props.status;
		var icon = '';
		
		// checks are performed by array length
		if (this.isInStatusGroup('valid', status)) {
			icon = 'tick';
		}
		else if (this.isInStatusGroup('neutral', status)) {
			icon = 'loading';
		}
		else if (this.isInStatusGroup('invalid', status)) {
			icon = 'warning';
		}

		return icon;
	},

	getElementStatus: function () {
		var status = this.props.status;
		var elementStatus = '';
		
		// checks are performed by array length
		if (this.isInStatusGroup('valid', status)) {
			elementStatus = 'valid';
		}
		else if (this.isInStatusGroup('neutral', status)) {
			elementStatus = 'neutral';
		}
		else if (this.isInStatusGroup('invalid', status)) {
			elementStatus = 'invalid';
		}

		return elementStatus;
	},

	transformStatus: function (str) {
		var frags = str.split('_');

		for (var i = 0, l = frags.length; i < l; i++) {
		  frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
		}

		str = frags.join('');
		
		return str.charAt(0).toLowerCase() + str.slice(1);
	},

	getStatusDescription: function () {
		return this.i18n('download_status_' + this.transformStatus(this.props.status.toLowerCase()), '');
	},

	cancelDownload: function () {
		this.props.onCancel(this.props.id);
	},

	showDownload: function () {
		this.props.onShow(this.props.id);
	},

	removeDownload: function () {
		this.props.onRemove(this.props.id);
	},

	render: function () {
		var showButton;
		var removeButton;
		var cancelButton;

		var statusDescription;
		var statusDescriptionTag;

		var elementStatus = this.getElementStatus();
		var progress = elementStatus === 'neutral' ? <progress value={this.getProgress() * 100} max='100'></progress> : null;

		if (this.props.status === 'COMPLETED') {
			showButton = (<IconButton icon='view' onClick={this.showDownload} tooltipContent={this.i18n('download_showButton_tooltipContent')} />)
		}

		// still loading
		if (elementStatus === 'neutral') {
			statusDescriptionTag = (
				<p className={'status-description ' + elementStatus}>
					<span className='size'>
						{this.getSizeWithExtension(this.props.loaded)} of {this.getSizeWithExtension(this.props.size)}
					</span>
					<span className='speed'>{this.getSizeWithExtension(this.state.averageSpeed)}/s</span>
					<span className='time'>{this.getTimeLeft()}</span>
				</p>
			)

			cancelButton = <IconButton icon='close' onClick={this.cancelDownload} tooltipContent={this.i18n('download_cancelButton_tooltipContent')} />;
		}
		else {
			statusDescription = this.getStatusDescription();
		
			if (statusDescription) {
				statusDescriptionTag = <p className={'status-description ' + elementStatus}>{statusDescription}</p>
			}

			removeButton = <IconButton icon='bin' onClick={this.removeDownload} tooltipContent={this.i18n('download_removeButton_tooltipContent')} />;
		}

		return (
			<div className={'download'}>
				<h3>{this.props.name}</h3>
				{statusDescriptionTag}

				{progress}
					
				<div className='badge-wrapper'>
					{/*<Badge className={'status-' + elementStatus} label='i' />*/}
					<Badge className={'status-' + elementStatus}>
						<SvgIcon icon={this.getStatusIcon()} />
					</Badge>
				</div>

				<div className='action-buttons'>
					{showButton}
					{removeButton}
					{cancelButton}
				</div>
			</div>
		)
	}

});

module.exports = Download;