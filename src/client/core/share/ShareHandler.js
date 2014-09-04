/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Link = require('react-router-component').Link;
//var Async = require('react-async');

var events = require('../events/EventEmitterMixin');

var Download = require('./Download');
var DownloadDestination = require('./DownloadDestination');

var Upload = require('./Upload');

//var Button = require('../element/Button');
var IconButton = require('../element/IconButton');
var SvgIcon = require('../element/SvgIcon');

var ChannelMixin = require('../socket/ChannelMixin');
var I18nMixin = require('../i18n/I18nMixin');
var DownloadDestinationDropzoneMixin = require('./DownloadDestinationDropzoneMixin');

//var DialogHandler = require('../dialog/DialogHandler');
//var AddFolderDialog = require('../dialog/AddFolderDialog');

var SharedFoldersHandler = React.createClass({
	
	mixins: [
		ChannelMixin,
		I18nMixin,
		DownloadDestinationDropzoneMixin
		//events.mixinFor('dialogOpen'),
		//events.mixinFor('folderAdded')
	],

	channelNames: [
		'share',
		'folderdropzone'
	],
	
	initialChannelsState: { 
		destination: {
			error: null,
			path: ''
		}
	},

	updateShareChannelState: function (state) {
		if (state.uploads) {
			for (var id in state.uploads) {
				if (!Upload.isInStatusGroup('neutral', state.uploads[id].status)) {
					this.removeUpload(id);

					delete state.uploads[id];
				}
			}
		}

		this.setState(state);
	},

	showDownloads: function () {
		this.shareChannel.send('showDownloadDestination');
	},

	showDownload: function (id) {
		//alert('todo: open the download destination');
		this.shareChannel.send('showDownload', id);
	},

	removeDownloads: function () {
		if (this.state.downloads) {
			for (var id in this.state.downloads) {
				var status = this.state.downloads[id].status;

				if (Download.isRemovableStatus(status)) {
					this.removeDownload(id);
				}
			}
		}
	},

	cancelDownload: function (id) {
		this.shareChannel.send('cancelDownload', id);
	},

	removeDownload: function (id) {
		this.shareChannel.send('removeDownload', id);
	},

	removeUpload: function (id) {
		this.shareChannel.send('removeUpload', id);
	},

	cancelUpload: function (id) {
		this.shareChannel.send('cancelUpload', id);
	},

	handleDownloadDestinationButtonClick: function (event) {
		event.preventDefault();

		this.openDropzoneWindow();
	},

	render: function() {
		var downloadSectionButtons = [];
		var downloads = [];
		var uploads = [];
		var downloadListOrNotice;
		var uploadListOrNotice;

		if (this.state.downloads && Object.keys(this.state.downloads).length) {
			var downloadIds = Object.keys(this.state.downloads);

			downloadSectionButtons.push(
				<IconButton icon='view' onClick={this.showDownloads} tooltipContent={this.i18n('settings_share_downloads_showDownloadsButton_tooltipContent')} />
			);
			downloadSectionButtons.push(
				<IconButton icon='bin' onClick={this.removeDownloads} tooltipContent={this.i18n('settings_share_download_removeStoppedDownloadsButton_tooltipContent')} />
			);

			for (var i = 0, l = downloadIds.length; i < l; i++) {
				var id = downloadIds[i];
				var data = this.state.downloads[id];
				var download = <Download
					created={data.created}
					id={data.id}
					loaded={data.loaded}
					name={data.name}
					size={data.size}
					status={data.status}
					onCancel={this.cancelDownload}
					onRemove={this.removeDownload}
					onShow={this.showDownload} />;

				downloads.push(<li key={id}>{download}</li>);
			}

			downloadListOrNotice = (
				<ul className='download-list'>
					{downloads}
				</ul>
			);
		}
		else if (this.gotInitialState('share')) {
			downloadListOrNotice = (
				<p className='no-downloads notice'>{this.i18n('settings_share_downloads_noDownloadsRunning_notice')}</p>
			);
		}

		if (this.state.uploads && Object.keys(this.state.uploads).length) {
			var uploadIds = Object.keys(this.state.uploads);

			for (var i = 0, l = uploadIds.length; i < l; i++) {
				var id = uploadIds[i];
				var data = this.state.uploads[id];
				var upload = <Upload
					id={data.id}
					name={data.name}
					path={data.path}
					status={data.status}
					onCancel={this.cancelUpload} />;

				uploads.push(<li key={id}>{upload}</li>);
			}

			uploadListOrNotice = (
				<ul className='upload-list'>
					{uploads}
				</ul>
			)
		}
		else if (this.gotInitialState('share')) {
			uploadListOrNotice = (
				<p className='no-uploads notice'>{this.i18n('settings_share_uploads_noUploadsRunning_notice')}</p>
			)
		}

		return (
			<section className={'share-handler'}>
				<header>
					<h1>{this.i18n('settings_share_title')}</h1>
					<DownloadDestination 
						error={this.state.destination.error}
						path={this.state.destination.path}
						onDestinationButtonClick={this.handleDownloadDestinationButtonClick} />
				</header>

				<section>
					<header>
						<h2>{this.i18n('settings_share_downloads_title')}</h2>
						<div className='section-buttons'>
							{downloadSectionButtons}
						</div>
					</header>

					{downloadListOrNotice}
				</section>

				<section>
					<header>
						<h2>{this.i18n('settings_share_uploads_title')}</h2>
					</header>

					{uploadListOrNotice}
				</section>

				{this.getDropzone()}
			</section>
		)
	}
});

module.exports = SharedFoldersHandler;