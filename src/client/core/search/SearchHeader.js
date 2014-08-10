/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Link = require('react-router-component').Link;

var Badge = require('../element/Badge');
var IconButton = require('../element/IconButton');
var FormFactory = require('../form/FormFactory');

var SearchForm = require('./SearchForm');
var SearchResultsNotification = require('./SearchResultsNotification');
var DownloadProgressBar = require('../share/DownloadProgressBar');

var Menu = require('../menu/Menu');

// menu items
var AppStatusMenuItem = require('../menu/AppStatusMenuItem');
var SharedFolderMenuItem = require('../menu/SharedFolderMenuItem');
var DownloadsMenuItem = require('../menu/DownloadsMenuItem');

var SearchHeader = React.createClass({

	_headroom: null,

	componentDidMount: function () {
		var node = this.getDOMNode();
		var indicator = this.refs.searchFormHeightIndicator.getDOMNode();

		this.setLocationClassName(this.props);
		this._headroom = new Headroom(node, {
			offset: indicator.offsetHeight
		});

		this._headroom.init();
	},

	componentWillReceiveProps: function (nextProps) {
		this.setLocationClassName(nextProps);
	},

	componentWillUnmount: function () {
		this._headroom.destroy();
	},

	getInitialState: function () {
		return {
			locationClassName: ''
		}
	},

	setLocationClassName: function (props) {
		var indexRouteName = ' route-index';
		var route = props._ && props._.length ? props._[0].substr(1) : '';
		var locationClassName = route ? ' route-' + route : indexRouteName;

		this.setState({
			locationClassName: locationClassName,
			isFullscreen: (locationClassName === indexRouteName)
		});
	},

	render: function () {
		return (
			<section className={'search-header' + this.state.locationClassName}>
				<div className='animation-helper'></div>
				<div className='search-form-height–indicator' ref='searchFormHeightIndicator'></div>
				
				<SearchForm isFullscreen={this.state.isFullscreen} locationClassName={this.state.locationClassName}>
					<p>Mollis Ultricies Inceptos Vestibulum <a href='http://joernroeder.de'>Nullam</a></p>
				</SearchForm>

				<DownloadProgressBar />
				<Menu locationClassName={this.state.locationClassName}>
					<AppStatusMenuItem />
					<SharedFolderMenuItem />
					<DownloadsMenuItem />
				</Menu>

				<SearchResultsNotification />
			</section>
		)
	}

});

module.exports = SearchHeader;