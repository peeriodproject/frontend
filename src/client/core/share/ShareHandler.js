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
		this.shareChannel.send('showDownloadDestination');
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
					image='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjgwcHgiIGhlaWdodD0iNjBweCIgdmlld0JveD0iMCAwIDgwIDYwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPGcgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDguMDAwMDAwLCA1LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTAsNDcgQzAsNDguNjU3IDEuMzQzLDUwIDMsNTAgTDYxLDUwIEM2Mi42NTcsNTAgNjQsNDguNjU3IDY0LDQ3IEw2NCwxNSBMMCwxNSBMMCw0NyBMMCw0NyBaIE02MSw2IEwyMy45ODIsNiBMMTgsMCBMMywwIEMxLjM0MywwIDAsMS4zNDMgMCwzIEwwLDEyIEw2NCwxMiBMNjQsOSBDNjQsNy4zNDMgNjIuNjU3LDYgNjEsNiBaIE00MS43MzA3NjkyLDMzIEM0MS4wMjk3MzA4LDMzIDQwLjQ2MTUzODUsMzMuNTc1NTcxNCA0MC40NjE1Mzg1LDM0LjI4NTcxNDMgTDQwLjQ2MTUzODUsMzkuNDI4NTcxNCBMMjMuNTM4NDYxNSwzOS40Mjg1NzE0IEwyMy41Mzg0NjE1LDM0LjI4NTcxNDMgQzIzLjUzODQ2MTUsMzMuNTc1NTcxNCAyMi45NzAyNjkyLDMzIDIyLjI2OTIzMDgsMzMgQzIxLjU2ODE5MjMsMzMgMjEsMzMuNTc1NTcxNCAyMSwzNC4yODU3MTQzIEwyMSw0MC43MTQyODU3IEMyMSw0MS40MjQ0Mjg2IDIxLjU2ODE5MjMsNDIgMjIuMjY5MjMwOCw0MiBMMzEuOTk4NzMwOCw0MiBMMzIsNDIgTDMyLjAwMTI2OTIsNDIgTDQxLjczMDc2OTIsNDIgQzQyLjQzMTgwNzcsNDIgNDMsNDEuNDI0NDI4NiA0Myw0MC43MTQyODU3IEw0MywzNC4yODU3MTQzIEM0MywzMy41NzU1NzE0IDQyLjQzMTgwNzcsMzMgNDEuNzMwNzY5MiwzMyBaIE0yNy4zMjA4MzMzLDMwLjUzNDA5MzggTDMxLjA3MDgzMzMsMzQuNTk2NTkzOCBDMzEuMjk5NTgzMywzNC44NDQgMzEuNjMxMjUsMzUgMzIsMzUgQzMyLjM2ODc1LDM1IDMyLjcsMzQuODQ0IDMyLjkyOTE2NjcsMzQuNTk2NTkzNyBMMzYuNjc5MTY2NywzMC41MzQwOTM3IEMzNi44NzgzMzMzLDMwLjMxNzk2ODcgMzcsMzAuMDMyMzc1IDM3LDI5LjcxODc1IEMzNywyOS4wNDU1OTM4IDM2LjQ0MDQxNjcsMjguNSAzNS43NSwyOC41IEMzNS4zODEyNSwyOC41IDM1LjA0OTE2NjcsMjguNjU1NTkzOCAzNC44MjA4MzMzLDI4LjkwMzQwNjIgTDMzLjI1LDMwLjYwNTE4NzUgTDMzLjI1LDIzLjIxODc1IEMzMy4yNSwyMi41NDU1OTM3IDMyLjY5MDQxNjcsMjIgMzIsMjIgQzMxLjMwOTU4MzMsMjIgMzAuNzUsMjIuNTQ1NTkzNyAzMC43NSwyMy4yMTg3NSBMMzAuNzUsMzAuNjA1MTg3NSBMMjkuMTc5MTY2NywyOC45MDM0MDYyIEMyOC45NTA0MTY3LDI4LjY1NiAyOC42MTg3NSwyOC41IDI4LjI1LDI4LjUgQzI3LjU1OTU4MzMsMjguNSAyNywyOS4wNDU1OTM4IDI3LDI5LjcxODc1IEMyNywzMC4wMzIzNzUgMjcuMTIxNjY2NywzMC4zMTc5Njg3IDI3LjMyMDgzMzMsMzAuNTM0MDkzOCBaIiBmaWxsLW9wYWNpdHk9IjAuNzUiIGZpbGw9IiM1OTU5NTkiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik02NS4zMDQzNDc4LDQxLjY5NTY1MjIgTDY1LjMwNDM0NzgsMzcuMzA0MzQ3OCBDNjUuMzA0MzQ3OCwzNi41ODM5MTMgNjQuNzIwNDM0OCwzNiA2NCwzNiBDNjMuMjc5NTY1MiwzNiA2Mi42OTU2NTIyLDM2LjU4MzkxMyA2Mi42OTU2NTIyLDM3LjMwNDM0NzggTDYyLjY5NTY1MjIsNDEuNjk1NjUyMiBMNTguMzA0MzQ3OCw0MS42OTU2NTIyIEM1Ny41ODM5MTMsNDEuNjk1NjUyMiA1Nyw0Mi4yNzk1NjUyIDU3LDQzIEM1Nyw0My43MjA0MzQ4IDU3LjU4MzkxMyw0NC4zMDQzNDc4IDU4LjMwNDM0NzgsNDQuMzA0MzQ3OCBMNjIuNjk1NjUyMiw0NC4zMDQzNDc4IEw2Mi42OTU2NTIyLDQ4LjY5NTY1MjIgQzYyLjY5NTY1MjIsNDkuNDE2MDg3IDYzLjI3OTU2NTIsNTAgNjQsNTAgQzY0LjcyMDQzNDgsNTAgNjUuMzA0MzQ3OCw0OS40MTYwODcgNjUuMzA0MzQ3OCw0OC42OTU2NTIyIEw2NS4zMDQzNDc4LDQ0LjMwNDM0NzggTDY5LjY5NTY1MjIsNDQuMzA0MzQ3OCBDNzAuNDE2MDg3LDQ0LjMwNDM0NzggNzEsNDMuNzIwNDM0OCA3MSw0MyBDNzEsNDIuMjc5NTY1MiA3MC40MTYwODcsNDEuNjk1NjUyMiA2OS42OTU2NTIyLDQxLjY5NTY1MjIgTDY1LjMwNDM0NzgsNDEuNjk1NjUyMiBaIiBmaWxsPSIjMDBEOTdFIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=='
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