/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var DownloadButtonErrorTourMixin = {

	/*getDefaultProps: function () {
		return {
			error: '',
			target: null
		};
	},*/

	getTourForErrorStatus: function (errorStatus) {
		var status = {
			invalid_path: {
				showImmediate: false,
				steps: {
					showError: {
						title: this.i18n('downloadButtonErrorTour_invalidPath_title'),
						text: this.i18n('downloadButtonErrorTour_invalidPath_content'),
						buttons: [{
							text: 'Cancel',
							action: this.cancelErrorTour
						}, {
							text: this.i18n('downloadButtonErrorTour_invalidPath_setDownloadDestinationButton_label'),
							action: this.props.onSetDownloadDestination
						}]
					},
					success: {
						title: this.i18n('downloadButtonErrorTour_invalidPath_success_title'),
						text: this.i18n('downloadButtonErrorTour_invalidPath_success_content'),
						classes: 'shepherd-theme-success',
						buttons: false
					}
				}
			},
			fs_error: {
				showImmediate: false,
				steps: {
					showError: {
						title: this.i18n('downloadButtonErrorTour_fsError_showError_title'),
						text: this.i18n('downloadButtonErrorTour_fsError_showError_content'),
						buttons: [{
								text: 'Close',
								action: this.cancelErrorTour
						}, {
								text: 'Show File',
								action: this.handleShowDownload
						}]
					}
				}
			}
		};

		errorStatus = errorStatus.toLowerCase();

		return status[errorStatus] ? status[errorStatus] : null;
	},

	componentWillMount: function () {
		this._currentErrorTour = '';
		this._currentErrorTourCode = '';
		this._currentErrorTourStarted = false;
		this._showErrorTourImmediate = false;
		this._currentErrorTourTimeout = null;
	},

	componentDidUpdate: function () {
		if (this.props.error && this._showErrorTourImmediate) {
			if (this.props.error !== this._currentErrorTourCode) {
				if (this._currentErrorTour) {
					this.cancelErrorTour();
				}

				this._currentErrorTourCode = this.props.error;
				this.createErrorTour(this.props.error);
			}
		} else if (this._currentErrorTour) {
			// error is gone ... showing success step
			this.completeErrorTour();
		}
	},

	componentWillUnmount: function () {
		this.cancelErrorTour();
	},

	handleShowDownload: function () {
		try {
			this.props.onShowDownload(this.props.download.id);
		} catch (e) {
			console.log(e);
		}
	},

	showDelayedErrorTour: function () {
		this._showErrorTourImmediate = true;

		if (!this._currentErrorTour) {
			return;
		}

		if (!this._currentErrorTourStarted) {
			this._currentErrorTour.start();
		}
	},

	cancelErrorTour: function (event) {
		if (event) {
			event.preventDefault();
		}

		if (this._currentErrorTour) {
			this._currentErrorTour.cancel();
			this._currentErrorTour = null;
			this._currentErrorTourCode = '';
			this._currentErrorTourStarted = false;
		}

		if (this._currentErrorTourTimeout) {
			clearTimeout(this._currentErrorTourTimeout);
			this._currentErrorTourTimeout = null;
		}
	},

	completeErrorTour: function () {
		var _this = this;
		var completeStep;

		if (this._currentErrorTour) {
			console.log('move to success step and delay closing');
			completeStep = this._currentErrorTour.getById('success');
			console.log(completeStep);

			if (completeStep) {
				this._currentErrorTourTimeout = setTimeout(function () {
					_this.cancelErrorTour();
				}, 3500);

				this._currentErrorTour.show('success');
			}
			else {
				_this.cancelErrorTour();
			}
		}
	},

	createErrorTour: function (errorCode) {
		var tour = this.getTourForErrorStatus(errorCode);
		var stepNames;
		var step;

		if (!tour) {
			return;
		}

		if (this._currentErrorTour) {
			this.cancelErrorTour();
		}

		this._currentErrorTour = new Shepherd.Tour({
			defaults: {
				classes: 'shepherd-theme-error'
			}
		});

		stepNames = Object.keys(tour.steps);

		for (var i = 0, l = stepNames.length; i < l; i++) {
			console.log('adding step', stepNames[i]);
			step = $.extend({
				attachTo: {
					element: this.getDOMNode(),
					on: 'left'
				},
				tetherOptions: {
					offset: '0 10px',
					constraints: [{
						attachment: 'together',
						pin: false,
						to: 'window'
					}]
				}
			}, tour.steps[stepNames[i]]);

			this._currentErrorTour.addStep(stepNames[i], step);
		}

		if (tour.showImmediate === true || this._showErrorTourImmediate) {
			this._currentErrorTourStarted = true;
			this._currentErrorTour.start();
		}	
	}

};

module.exports = DownloadButtonErrorTourMixin;