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
var DropzoneBackroundRenderer = require('../utils/DropzoneBackroundRenderer');

var Upload = require('./Upload');

//var Button = require('../element/Button');
var IconButton = require('../element/IconButton');
var SvgIcon = require('../element/SvgIcon');

var ChannelMixin = require('../socket/ChannelMixin');
var I18nMixin = require('../i18n/I18nMixin');

//var DialogHandler = require('../dialog/DialogHandler');
//var AddFolderDialog = require('../dialog/AddFolderDialog');

var SharedFoldersHandler = React.createClass({
	
	_dropzoneBackground: null,
	_dropzoneButton: null,

	mixins: [
		ChannelMixin,
		I18nMixin,
		events.mixinFor('dialogOpen'),
		events.mixinFor('folderAdded')
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

	updateFolderdropzoneChannelState: function (state) {
		var paths = state.downloadDestination || [];

		if (paths.length) {
			this.shareChannel.send('updateDownloadDestination', paths[0]);
		}
	},

	updateChannelState: function (channel, state) {
		console.warn('got event from unhandled channel:', channel);
		console.warn(state);		
	},

	handleDownloadDestinationButtonClick: function (event) {
		event.preventDefault();

		this.folderdropzoneChannel.send('open', 'downloadDestination', this._dropzoneBackground, this._dropzoneButton);
		//this.emitDialogOpen('addFolderDialog');
	},

	showDownloads: function () {
		alert('todo: open the download destination');
	},

	showDownload: function (id) {
		alert('todo: open the download destination');
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

	removeDownload: function (id) {
		this.shareChannel.send('removeDownload', id);
	},

	removeUpload: function (id) {
		this.shareChannel.send('removeUpload', id);
	},

	cancelDownload: function (id) {
		this.shareChannel.send('cancelDownload', id);
	},

	cancelUpload: function (id) {
		this.shareChannel.send('cancelUpload', id);
	},

	/*refreshFolder: function (path) {
		// we're checking all folder paths at once.
		this.folderChannel.send('syncFolders');
	},

	showFolder: function (path) {
		this.folderChannel.send('showFolder', path);
	},*/

	/*onBackgroundColorChange: function (background, color, inverted, invertedBackgroundColor) {
		// the background isn't added to the state as we're just piping it to the dropzone!
		this.folderdropzoneChannel.send('background', {
			background: background,
			color: color,
			inverted: inverted,
			invertedBackgroundColor: invertedBackgroundColor
		});
	},*/

	dropzoneRendered: function (data) {
		this._dropzoneBackground = data.background;
		this._dropzoneButton = data.button;
	},

	render: function() {
		var dropzone;
		var downloadSectionButtons = [];
		var downloads = [];
		var uploads = [];
		var downloadListOrNotice;
		var uploadListOrNotice;

		if (!this.state.hasRenderedDropzone) {
			dropzone = (
				<DropzoneBackroundRenderer
					title={this.i18n('dropzone_selectDownloadDestination_title')}
					description={this.i18n('dropzone_selectDownloadDestination_description')}
					onRendered={this.dropzoneRendered} />
			)
		}

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
		else {
			downloadListOrNotice = (
				<p className='no-downloads notice'>{this.i18n('settings_share_downloads_noUploadsRunning_notice')}</p>
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
		else {
			uploadListOrNotice = (
				<p className='no-uploads notice'>{this.i18n('settings_share_uploads_noUploadsRunning_notice')}</p>
			)
		}

		return (
			<section className='share-handler'>
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

				{dropzone}
			</section>
		)
	}
});

module.exports = SharedFoldersHandler;