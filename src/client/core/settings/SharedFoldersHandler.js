/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Link = require('react-router-component').Link;
//var Async = require('react-async');

var events = require('../events/EventEmitterMixin');

var DropzoneBackroundRenderer = require('../utils/DropzoneBackroundRenderer');
var Folder = require('./Folder');
//var Button = require('../element/Button');
var SvgIcon = require('../element/SvgIcon');

var ChannelMixin = require('../socket/ChannelMixin');
var I18nMixin = require('../i18n/I18nMixin');

var NoSharedFoldersNotice = require('./NoSharedFoldersNotice');

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
		'folder',
		'folderdropzone'
	],
	
	initialChannelsState: { 
		folders: []
	},

	updateFolderChannelState: function (state) {
		this.setState({
			folders: state
		});
	},

	updateFolderdropzoneChannelState: function (state) {
		var paths = state.sharedFolders || [];

		if (paths.length) {
			for (var i = 0, l = paths.length; i < l; i++) {
				this.folderChannel.send('addFolder', paths[i]);
			}
		}
	},

	handleAddFolderButtonClick: function (event) {
		event.preventDefault();

		this.folderdropzoneChannel.send('open', 'sharedFolders', this._dropzoneBackground, this._dropzoneButton);
	},

	removeFolder: function (path) {
		this.folderChannel.send('removeFolder', path);
	},

	refreshFolder: function (path) {
		// we're checking all folder paths at once.
		this.folderChannel.send('syncFolders');
	},

	showFolder: function (path) {
		this.folderChannel.send('showFolder', path);
	},

	dropzoneRendered: function (data) {
		this._dropzoneBackground = data.background;
		this._dropzoneButton = data.button;
	},

	render: function() {
		var dropzone;
		var noSharedFoldersNotice;
		var hasFoldersClassName = '';
		var folders = {};

		if (!this.state.hasRenderedDropzone) {
			dropzone = (
				<DropzoneBackroundRenderer
					title={this.i18n('dropzone_selectSharedFolder_title')}
					description={this.i18n('dropzone_selectSharedFolder_description')}
					onRendered={this.dropzoneRendered} />
			)
		}

		if (this.state.folders && this.state.folders.length) {
			hasFoldersClassName = ' has-folders';

			for (var i in this.state.folders) {
				var folder = this.state.folders[i];
				folders[folder.path] = <Folder onRemove={this.removeFolder} onRefresh={this.refreshFolder} onShow={this.showFolder} name={folder.name} path={folder.path} status={folder.status} items={folder.items} />;
			}
		}
		else {
			noSharedFoldersNotice = (
				<NoSharedFoldersNotice
					title={this.i18n('settings_sharedFolders_noSharedFoldersNotice_title')}
					description={this.i18n('settings_sharedFolders_noSharedFoldersNotice_description')} />
			);
		}

		return (
			<section className={'shared-folders-handler' + hasFoldersClassName}>
				<header>
					<h1>{this.i18n('settings_sharedFolders_title')}</h1>
					<div className='add-folder-button'>
						<a href='#' ref='addFolderButton' onClick={this.handleAddFolderButtonClick}>
							<SvgIcon icon='plus' /> {this.i18n('settings_sharedFolders_addFolderButton_label')}
						</a>
					</div>
				</header>
				
				{folders}
				{noSharedFoldersNotice}
				{dropzone}
			</section>
		)
	}
});

module.exports = SharedFoldersHandler;