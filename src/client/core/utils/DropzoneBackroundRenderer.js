/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var SvgIcon = require('../element/SvgIcon');
var I18nMixin = require('../i18n/I18nMixin');

var DropzoneBackroundRenderer = React.createClass({

	mixins: [
		I18nMixin
	],

	getDefaultProps: function () {
		return {
			title: '',
			description: '',
			image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48cGF0aCBkPSJNMCA1NGMwIDEuNjU3IDEuMzQzIDMgMyAzaDU4YzEuNjU3IDAgMy0xLjM0MyAzLTN2LTMyaC02NHYzMnptNjEtNDFoLTM3LjAxOGwtNS45ODItNmgtMTVjLTEuNjU3IDAtMyAxLjM0My0zIDN2OWg2NHYtM2MwLTEuNjU3LTEuMzQzLTMtMy0zeiIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyIvPjwvc3ZnPg==',
			onRendered: function () {}
		}
	},

	getInitialState: function () {
		return {
			renderedBackground: '',
			renderedButton: ''
		};
	},

	componentWillMount: function () {
		this._rendered = false;
	},

	componentDidMount: function () {
		if (!this._rendered) {
			this.renderBackground();
			this.renderButton();
		}
	},

	componentShouldUpdate: function (nextProps, nextState) {
		if (this._rendered) {
			return false;
		}
	},

	componentWillUpdate: function (nextProps, nextState) {
		if (nextState.renderedButton && nextState.renderedBackground && !this._rendered) {
			this.props.onRendered({
				background: nextState.renderedBackground,
				button: nextState.renderedButton
			});
			
			this._rendered = true;
		}
	},

	renderBackground: function () {
		var _this = this;

		html2canvas(this.refs.dropzoneRenderer.getDOMNode(), {
			background: undefined,
			onrendered: function(canvas) {
				_this.setState({
					renderedBackground: canvas.toDataURL()
				});
			}
		});
	},

	renderButton: function () {
		var _this = this;

		html2canvas(this.refs.buttonRenderer.getDOMNode(), {
			background: undefined,
			onrendered: function(canvas) {
				_this.setState({
					renderedButton: {
						source: canvas.toDataURL(),
						width: _this.refs.buttonRendererWidthReference.getDOMNode().offsetWidth,
						height: canvas.height / 2
					}
				});
			}
		});
	},

	render: function () {
		return (
			<div className='dropzone-renderer-wrapper' style={{ display: (this._rendered ? 'none' : 'block') }}>
				<div ref='dropzoneRenderer' className='dropzone-renderer'>
					<img src={this.props.image} />
					<h2>{this.props.title}</h2>
					<p>{this.props.description}</p>
				</div>
				<div ref='buttonRenderer' className='dropzone-button-renderer'>
					<div>
						<a href='#' ref='buttonRendererWidthReference' className='btn'>{this.i18n('dropzone_closeButton_title')}</a>
					</div>
					<div>
						<a href='#' className='btn hover'>{this.i18n('dropzone_closeButton_title')}</a>
					</div>
				</div>
			</div>
		)
	}

});

module.exports = DropzoneBackroundRenderer;