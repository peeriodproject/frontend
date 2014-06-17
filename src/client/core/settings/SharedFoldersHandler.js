/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Link = require('react-router-component').Link;
//var Async = require('react-async');

var events = require('../events/EventEmitterMixin');

var Folder = require('./Folder');
var Button = require('../elements/Button');

var ChannelMixin = require('../socket/ChannelMixin');
var I18nMixin = require('../i18n/I18nMixin');

var DialogHandler = require('../dialog/DialogHandler');

var SharedFoldersHandler = React.createClass({
	
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

	updateFolderdropzoneChannelState: function (paths) {
		console.log('got state from dropzone channel:', paths);

		if (paths.length) {
			for (var i = 0, l = paths.length; i < l; i++) {
				this.folderChannel.send('addFolder', paths[i]);
			}
		}
		//console.log(state);
	},

	updateChannelState: function (channel, state) {
		console.log('got event from unhandled channel:', channel);
		console.log(state);		
	},

	addFolder: function(event) {
		this.folderdropzoneChannel.send('open');
		//this.emitDialogOpen('addFolderDialog');
	},

	onFolderAdded: function (path) {
		console.log('folder added:', path);
		//this.folderChannel.send('addFolder')
	},

	render: function() {
		var folders = {};

		if (this.state.folders && this.state.folders.length) {
			for (var i in this.state.folders) {
				var folder = this.state.folders[i];
				folders[folder.path] = <Folder name={folder.name} path={folder.path} status={folder.status} items={folder.items} />;
			}
		}

		return (
			<main className="main">
				<section className="shared-folders-handler">
					<header>
						<h1 className='bg-color-dark'>{this.i18n('settings_sharedFolders_title')}</h1>
						<div className="add-folder-button">
							<Button onClick={this.addFolder} label='settings_sharedFolders_addFolderButton_label' />
						</div>
					</header>
					
					{folders}
				</section>
			</main>
		)
	}
});

module.exports = SharedFoldersHandler;