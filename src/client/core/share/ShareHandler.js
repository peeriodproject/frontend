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

//var DialogHandler = require('../dialog/DialogHandler');
//var AddFolderDialog = require('../dialog/AddFolderDialog');

var SharedFoldersHandler = React.createClass({
	
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

		this.folderdropzoneChannel.send('open', 'downloadDestination');
		//this.emitDialogOpen('addFolderDialog');
	},

	showDownloads: function () {
		console.log('todo: show downloads folder');
	},

	removeDownloads: function () {
		console.log('todo: clean up the downloads list / iteration over downloads and send removeFolder down the wire');
	},

	/*removeFolder: function (path) {
		this.folderChannel.send('removeFolder', path);
	},

	refreshFolder: function (path) {
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

	render: function() {
		var downloads = {};

		/*if (this.state.downloads && this.state.folders.length) {
			for (var i in this.state.folders) {
				var folder = this.state.folders[i];
				folders[folder.path] = <Folder onRemove={this.removeFolder} onRefresh={this.refreshFolder} onShow={this.showFolder} name={folder.name} path={folder.path} status={folder.status} items={folder.items} />;
			}
		}*/

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
							<IconButton icon='view' onClick={this.showDownloads} tooltipContent={this.i18n('settings_share_downloads_showButton_tooltipContent')} />
							<IconButton icon='bin' onClick={this.removeDownloads} tooltipContent={this.i18n('settings_share_download_removeButton_tooltipContent')} />
						</div>
					</header>

					<ul className='download-list'>
						<li><Download id='123abc' name='Filename.txt' created={new Date().getTime()} loaded={456789} size={897867} status='FS_ERROR' /></li>
						<li><Download id='abc123' name='Filename.txt' created={new Date().getTime()} loaded={456789} size={897867} status='TRANSFER_STARTED' /></li>
					</ul>
				</section>

				<section>
					<header>
						<h2>{this.i18n('settings_share_uploads_title')}</h2>
					</header>

					<ul className='upload-list'>
						<li><Upload id='321cba' name='Filename.txt' path='/path/to/file.txt' status='UPLOAD_STARTED' /></li>
					</ul>
				</section>
			</section>
		)
	}
});

module.exports = SharedFoldersHandler;