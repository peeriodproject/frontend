/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Link = require('react-router-component').Link;
//var Async = require('react-async');

var events = require('../events/EventEmitterMixin');

var Folder = require('./Folder');
//var Button = require('../element/Button');
var SvgIcon = require('../element/SvgIcon');

var ChannelMixin = require('../socket/ChannelMixin');
var I18nMixin = require('../i18n/I18nMixin');

//var DialogHandler = require('../dialog/DialogHandler');
//var AddFolderDialog = require('../dialog/AddFolderDialog');

var SearchHeader = require('../search/SearchHeader');

var SharedFoldersHandler = React.createClass({
	
	mixins: [
		ChannelMixin,
		I18nMixin,
		events.mixinFor('dialogOpen'),
		events.mixinFor('folderAdded'),
		events.mixinFor('backgroundColorChange')
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

	updateFolderdropzoneChannelState: function (paths) {
		if (paths.length) {
			for (var i = 0, l = paths.length; i < l; i++) {
				this.folderChannel.send('addFolder', paths[i]);
			}
		}
	},

	updateChannelState: function (channel, state) {
		console.warn('got event from unhandled channel:', channel);
		console.warn(state);		
	},

	handleAddFolderButtonClick: function (event) {
		event.preventDefault();

		this.folderdropzoneChannel.send('open', this._background);
		//this.emitDialogOpen('addFolderDialog');
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

	onBackgroundColorChange: function (background, color, inverted, invertedBackgroundColor) {
		// the background isn't added to the state as we're just piping it to the dropzone!
		this.folderdropzoneChannel.send('background', {
			background: background,
			color: color,
			inverted: inverted,
			invertedBackgroundColor: invertedBackgroundColor
		});
	},

	render: function() {
		var folders = {};

		if (this.state.folders && this.state.folders.length) {
			for (var i in this.state.folders) {
				var folder = this.state.folders[i];
				folders[folder.path] = <Folder onRemove={this.removeFolder} onRefresh={this.refreshFolder} onShow={this.showFolder} name={folder.name} path={folder.path} status={folder.status} items={folder.items} />;
			}
		}

		return (
			<section className='shared-folders-handler'>
				<header>
					<h1>{this.i18n('settings_sharedFolders_title')}</h1>
					{/*<div className='add-folder-button'>
						<Button onClick={this.addFolder} label='settings_sharedFolders_addFolderButton_label' />
					</div>*/}
					<div className='add-folder-button'>
						<a href='#' ref='addFolderButton' onClick={this.handleAddFolderButtonClick}>
							<SvgIcon icon='plus' /> {this.i18n('settings_sharedFolders_addFolderButton_label')}
						</a>
					</div>
				</header>
				
				{folders}
			</section>
		)
	}
});

module.exports = SharedFoldersHandler;