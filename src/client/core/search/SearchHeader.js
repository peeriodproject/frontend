/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var IconButton = require('../element/IconButton');
var FormFactory = require('../form/FormFactory');

var SearchForm = require('./SearchForm');
var DownloadProgressBar = require('../element/DownloadProgressBar');

var Menu = require('../menu/Menu');
var MenuButton = require('../menu/MenuButton');

// menu items
var AppStatusMenuItem = require('../menu/AppStatusMenuItem');
var SharedFolderMenuItem = require('../menu/SharedFolderMenuItem');
var DownloadsMenuItem = require('../menu/DownloadsMenuItem');

var SearchHeader = React.createClass({

	render: function () {
		return (
			<section className='search-header'>
				<MenuButton />
				<SearchForm />
				<DownloadProgressBar />
				<Menu>
					<AppStatusMenuItem />
					<SharedFolderMenuItem />
					<DownloadsMenuItem />
				</Menu>
			</section>
		)
	}

});

module.exports = SearchHeader;