/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Link = require('react-router-component').Link;
//var Async = require('react-async');

var Folder = require('./Folder');
var Button = require('../elements/Button');

var ChannelMixin = require('../socket/ChannelMixin');
var I18nMixin = require('../i18n/I18nMixin');

var SharedFoldersHandler = React.createClass({
	mixins: [ChannelMixin, I18nMixin],

	channelName: 'folder',
	initialState: { folders: [] },

	updateChannelState: function (state) {
		this.replaceState({
			folders: state
		});
	},

	addFolder: function(event) {
		event.preventDefault();
		event.target.blur();

		this.channel.send('addFolder', prompt('add path', '/torrent'));

		/*var folders = this.state.folders || [];
		folders.push({
			name: 'foo-' + Date.now(),
			path: '/fdkjg/.dfg/fhgg',
			status: 'foo',
			items: 135
		});

		this.setState({
			folders: folders
		});*/
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
			<main>
				<section className="shared-folders-handler">
					<header>
						<h1>{this.i18n('settings_sharedFolders_title')}</h1>
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