/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Link = require('react-router-component').Link;
var Async = require('react-async');

var Folder = require('./Folder');
var Button = require('../elements/Button');

var SharedFoldersHandler = React.createClass({
	mixins: [Async.Mixin],

	getInitialStateAsync: function(cb) {
		setTimeout(function () {
			cb(null, {
				message: 'foobar',
				folders: [
					{
						name: 'Folder Name',
						path: '/path/to/folder',
						status: 'active'
					}
				]
			});
		}, 0);
	},

	componentDidMount: function () {
		var inputNode = this.folderInput.getDOMNode();

		inputNode.setAttribute('directory', '');
		inputNode.setAttribute('webkitdirectory', '');
	},

	i18n: function (key) {
		return chrome.i18n.getMessage(key);
	},

	addFolder: function(event) {
		console.log('adding folder');
		console.log(this);
		var folders = this.state.folders || [];
		folders.push({
			name: 'foo-' + Date.now(),
			path: '/fdkjg/.dfg/fhgg',
			status: 'foo'
		});

		this.setState({
			folders: folders
		});

		this.folderInput.getDOMNode().click();
	},

	folderInput: <input type='file' webkitdirectory='' directory='' />,

	render: function() {
		var folders = {};

		if (this.state.folders && this.state.folders.length) {
			for (var i in this.state.folders) {
				var folder = this.state.folders[i];
				folders['folder-' + i] = <Folder name={folder.name} path={folder.path} status={folder.status} />;
			}
		}

		return (
			<section className="settings">
				<header>
					<h1>{this.i18n('settings_sharedfolders_title')}</h1>
					<h2>Vulputate Fringilla Consectetur</h2>
				</header>
				{this.folderInput}
				<Button onClick={this.addFolder} label='Add Folder' />
				
				<hr />
				{folders}
				<hr />
				<p><Link href='/foo/username-state-from-url'>Login</Link></p>
				<div>{this.state.message}</div>
			</section>
		)
	}
});

module.exports = SharedFoldersHandler;