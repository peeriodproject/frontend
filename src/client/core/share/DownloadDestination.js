/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');

var DownloadDestination = React.createClass({

	mixins: [
		I18nMixin
	],

	getDefaultProps: function () {
		return {
			error: null,
			path: '',
			onDestinationButtonClick: function () {
			},
			errorTourSolvedDelay: 1500
		};
	},

	getInitialState: function () {
		return {
			hasError: false,
			errorClassName: ''
		};
	},

	componentDidMount: function () {
		this._errorTour = new Shepherd.Tour({
			defaults: {
				classes: 'shepherd-theme-error',
				scrollTo: true
			}
		});

		this.setErrorState(this.props);
	},

	componentWillReceiveProps: function (nextProps) {
		this.setErrorState(nextProps);
	},

	componentDidUpdate: function () {
		this.updateErrorTour();
	},

	componentWillUnmount: function () {
		if (this._errorTourSolvedTimeout) {
			clearTimeout(this._errorTourSolvedTimeout);
		}
		
		if (this._errorTour) {
			this._errorTour.cancel();
			this._errorTour = null;
		}
	},

	setErrorState: function (nextProps) {
		var hasError = nextProps.error && Object.keys(nextProps.error).length ? true : false;

		this.setState({
			hasError: hasError,
			errorClassName: hasError ? 'error' : ''
		});
	},

	updateErrorTour: function () {
		var _this = this;
		var currentStep;

		if (this.state.hasError) {
			this.startErrorTour();
		}
		else if (this._errorTour) {
			currentStep = this._errorTour.getCurrentStep();

			// the error message is shown and no timeout for the solved message is set
			if (currentStep && currentStep.id === 'show-error' && !this._errorTourSolvedTimeout) {
				this._errorTour.show('error-solved');

				this._errorTourSolvedTimeout = setTimeout(function () {
					_this.hideTourSolvedStep();
				}, this.props.errorTourSolvedDelay);

				this.setState({
					buttonClassName: 'solved'
				});
			}
		}

		currentStep = null;
	},

	startErrorTour: function () {
		if (this._errorTour.steps.length) {
			return;
		}

		this._errorTour.addStep('show-error', {
			title: this.i18n('downloadDestination_warning_noDownloadDestination_title'),
			text: this.i18n('downloadDestination_warning_noDownloadDestination_content'),
			attachTo: {
				element: this.refs.downloadDestinationButton.getDOMNode(),
				on: 'left'
			},
			tetherOptions: {
				offset: '0 10px'
			},
			buttons: []
		});

		this._errorTour.addStep('error-solved', {
			title: this.i18n('downloadDestination_solved_noDownloadDestination_title'),
			text: this.i18n('downloadDestination_solved_noDownloadDestination_content'),
			attachTo: {
				element: this.refs.downloadDestinationButton.getDOMNode(),
				on: 'left'
			},
			classes: 'shepherd-theme-success',
			tetherOptions: {
				offset: '0 10px'
			},
			buttons: []
		});

		this._errorTour.start();
		//this._errorTour.next();
	},

	hideTourSolvedStep: function () {
		if (this._errorTour) {
			this._errorTour.cancel();
		}

		this.setState({
			buttonClassName: ''
		});
	},

	render: function () {
		var classNames = [];
		var labelKey = this.state.hasError ? 'downloadDestination_button_label_setFolder' : 'downloadDestination_button_label_updateFolder';

		([this.state.buttonClassName, this.state.errorClassName]).forEach(function (className) {
			if (className) {
				classNames.push(className);
			}
		});
		
		return (
			<div className='download-destination-button'>
				<a href='#' ref='downloadDestinationButton' onClick={this.props.onDestinationButtonClick} className={classNames.join(' ')}>
					{this.i18n(labelKey)}
				</a>
			</div>
		)
	}

});

module.exports = DownloadDestination;