/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Button = require('../element/Button');

var events = require('../events/EventEmitterMixin');

var DialogHandler = function (dialogs) {
	var _dialogs = dialogs || {};

	return React.createClass({
		mixins: [
			events.mixinFor('dialogOpen'),
			events.mixinFor('dialogClose')
		],

		_closingTimeout: null,

		getInitialState: function () {
			return {
				closing: false,
				dialog: null
			};
		},

		componentWillUnmount: function () {
			this.cleanup();
		},

		onDialogOpen: function (key, value) {
			if (_dialogs[key]) {
				if (this._closingTimeout) {
					clearTimeout(this._closingTimeout);
				}

				this.setState({
					dialog: _dialogs[key]
				});
			}
		},

		onDialogClose: function () {
			if (!this.state.dialog) {
				return;
			}

			this.setState({
				closing: true
			});

			this._closingTimeout = setTimeout(function () {
				this.cleanup();
			}.bind(this), 250);

			//$('body').removeClass('dialog-open');

		},

		cleanup: function () {
			this.setState({
				closing: false,
				dialog: null
			});

			$('body').removeClass('dialog-open');
		},
		
		render: function () {
			var Dialog = this.state.dialog;
			var hasDialog = Dialog ? true : false;
			var transitionClass = this.state.closing ? 'bounceOutUp' : 'bounceInDown';
			var dialogWrapper;

			if (hasDialog) {
				dialogWrapper = (
					<div className={'dialog bg-color-background animated ' + transitionClass}>
						<Dialog foo='bar' />
					</div>
				);

				$('body').addClass('dialog-open');
			}

			return hasDialog ? dialogWrapper : <span className='hidden'></span>;
		}

	})
};

module.exports = DialogHandler;