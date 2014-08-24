/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var moment = require('moment');

var I18nMixin = require('../i18n/I18nMixin');

var Download = require('../share/Download');
var DownloadButton = require('../share/DownloadButton');

var SearchResult = React.createClass({

	mixins: [
		I18nMixin
	],

	getDefaultProps: function () {
		return {
			resultId: '',
			size: 0,
			created: 0,
			download: {},
			destination: {},
			onDownloadStart: function () {},
			//onDownloadAbort: function () {}
			onSetDownloadDestination: function () {},
			onShowDownload: function () {}
		};
	},

	getInitialState: function () {
		return {
			showError: false
		}
	},

	componentDidMount: function () {
		//this._errorTour = null;

		//this.setErrorState(this.props);
	},

	componentDidUpdate: function () {
		//this.startErrorTour();
	},

	componentWillUnmount: function () {
		//this.cleanupErrorTour();
		//this._errorTour = null;
	},

	/*getErrorKeys: function () {
		console.log(this.props.error);
		console.log(this.props.download);

		return {
			title: 'key',
			content: 'key',
			buttonLabel: 'key'
		};
	},*/

	handleDownloadButtonClick: function (e) {
		e.preventDefault();

		/*this.setState({
			showError: this._errorTour ? false : true
		});*/

		this.props.onDownloadStart(this.props.resultId);
	},

	/*cleanupErrorTour: function () {
		if (this._errorTour) {
			this._errorTour.off('cancel', this.redirectToDownloadsOnTourEnd);
			this._errorTour.cancel();
		}
	},*/

	/*setErrorState: function (nextProps) {
		var hasError = nextProps.error ? true : false;
		var hasDownloadError = nextProps.download && Download.isInStatusGroup(nextProps.download.status, 'invalid') ? true : false;
		
		if (hasError && this.state.showError) {
			this._errorTour = new Shepherd.Tour({
				defaults: {
					classes: 'shepherd-theme-error'
				}
			});

			this._errorTour.once('cancel', this.redirectToDownloadsOnTourEnd, this);
		}
		//else if (hasDownloadError)
	},*/

	/*redirectToDownloadsOnTourEnd: function () {
		this.cleanupErrorTour();
		/*this.setState({
			showError: false
		});* /

		this.navigate('/share');
	},*/

	/*startErrorTour: function () {
		if (!this._errorTour || !this.state.showError || this._errorTour.steps.length) {
			return;
		}

		var buttons = [];
		var errorKeys = this.getErrorKeys();
		
		if (errorKeys.buttonLabel) {
			buttons.push({
				text: 'searchResult_error_' + errorKeys.buttonLabel + '_button_label',
				action: this._errorTour.cancel
			})
		}

		this._errorTour.addStep('show-error', {
			title: this.i18n('searchResult_error_' + errorKeys.title + '_title'),
			text: this.i18n('searchResult_error_' + errorKeys.content + '_content'),
			attachTo: {
				element: this.refs.downloadButton.getDOMNode(),
				on: 'left'
			},
			tetherOptions: {
				offset: '0 10px',
				constraints: [{
					attachment: 'together',
					pin: false,
					to: 'window'
				}]
			},
			buttons: buttons
		});

		this._errorTour.start();
	},*/

	render: function () {
		var size = this.props.size ? Download.getSizeWithExtension(this.props.size) : '';
		var created = this.props.created ? moment(this.props.created).fromNow() : '';

		return (
			<li className='animated fadeIn'>
				<div className='download-progress'></div>
				<div className='result-content'>
					{this.props.children}
				</div>
				<footer className='meta'>
					<div className='result-meta'>
						<span className='size'>{size}</span> <span className='seperator'>{'\u00B7'}</span> <span className='created'>{created}</span>
					</div>
					<DownloadButton ref='downloadButton' 
						onClick={this.handleDownloadButtonClick} 
						onSetDownloadDestination={this.props.onSetDownloadDestination}
						onShowDownload={this.props.onShowDownload}
						download={this.props.download} 
						destination={this.props.destination} />
				</footer>
			</li>
		)
	}

});

module.exports = SearchResult;