/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Chroma = require('chroma-js');

var events = require('../events/EventEmitterMixin');

var BackgroundHandler = React.createClass({

	mixins: [
		events.mixinFor('backgroundColorChange')
	],

	getDefaultProps: function () {
		return {
			minContrast: 4.5,
			activeAlpha: 0.2,
			hoverAlpha: 0.1,
			transitionKeys: ['color', 'background-color', 'border-color'],
			intervalInSeconds: 2
		};
	},

	getInitialState: function () {
		return {
			secondsElapsed: Math.round(Math.random() * 255),
			color: new Chroma('#fff'),
			invertedBackground: new Chroma('#fff'),
			background: new Chroma('#000'),
			invert: new Chroma('#000'),
			invertedBackgroundColor: new Chroma('#000')
		};
	},

	tick: function () {
		var secondsElapsed = this.state.secondsElapsed + 1;
		var background = new Chroma('hsl(' + (this.state.secondsElapsed % 255) +  ', 100%, ' + (this.state.secondsElapsed % 100) + '%)');
		var color = this.getColor();
		var invertedBackgroundColor = color;
		var backgroundHsl = background.hsl();
		var invertedBackground;

		if (Chroma.contrast(background, color) < this.props.minContrast) {
			color = this.toggleColor();
		}

		// invert color
		var h = backgroundHsl.shift();
		h = h + 180 % 360;
		backgroundHsl.unshift(h);

		invertedBackground = new Chroma.hsl(backgroundHsl[0], backgroundHsl[1], backgroundHsl[2]);

		if (Chroma.contrast(invertedBackground, color) < this.props.minContrast) {
			invertedBackgroundColor = this.toggleColor(invertedBackgroundColor);
		}

		this.emitBackgroundColorChange(background.hex(), color.hex(), invertedBackground.hex(), invertedBackgroundColor.hex());

		this.setState({
			secondsElapsed: secondsElapsed,
			color: color,
			invert: this.toggleColor(color),
			background: background,
			invertedBackground: invertedBackground,
			invertedBackgroundColor: invertedBackgroundColor
		});
	},

	toggleColor: function (color) {
		var color = color || this.getColor();

		return color.luminance() ? color.darken(100) : color.brighten(100);
	},

	componentDidMount: function () {
		this.interval = setInterval(this.tick, this.props.intervalInSeconds * 1000);
	},

	componentWillUnmount: function () {
		clearInterval(this.interval);
	},

	getBackgroundColor: function () {
		return this.state.background;
	},

	getColor: function () {
		return this.state.color;
	},

	getInvertedColor: function () {
		return this.state.invert;
	},

	getAlphaColor: function (alpha) {
		return Chroma.scale([
			this.getBackgroundColor(),
			new Chroma(this.getColor())
		])(alpha);
	},

	getInvertedAlphaColor: function (alpha) {
		return Chroma.scale([
			this.getInvertedColor(),
			new Chroma(this.getColor())
		])(1 - alpha);
	},

	getTransitions: function (transitions) {
		var styles = [];

		for (var i = 0, l = transitions.length; i < l; i++) {
			var tansition = transitions[i];
			var duration = tansition.duration || this.props.intervalInSeconds;

			styles.push(tansition.key + ' ' + duration + 's linear');
		}

		return 'transition: ' + styles.join(', ');
	},

	/*getTransitionForKey: function (key, transitionDuration) {
		var duration = transitionDuration || this.props.intervalInSeconds;
		return 'transition: ' + key + ' ' + duration + 's linear';
	},*/

	createElementStyles: function (selector, styles, transitionDuration) {
		var keys = Object.keys(styles);
		var style = [];
		var transitions = [];
		
		for (var i = 0, l = keys.length; i < l; i++) {
			var key = keys[i];
			style.push(key + ': ' + styles[key]);

			if (this.props.transitionKeys.indexOf(key) !== -1) {
				transitions.push({
					key: key,
					duration: transitionDuration
				});
			}
		}

		if (transitions.length) {
			style.push(this.getTransitions(transitions));
		}

		return selector + ' {\n\t' + style.join(';\n\t') + '\n}';
	},

	createStyles: function (styles) {
		return styles.join('\n');
	},

	render: function () {
		//var wrapper = '#wrapper { background-color: ; }';
		var styles = this.createStyles([
			this.createElementStyles('body, .bg', {
				'background-color': this.getBackgroundColor().hex()
			}),

			this.createElementStyles('.bg-hover', {
				'background-color': this.getAlphaColor(this.props.hoverAlpha).hex()
			}),

			this.createElementStyles('.bg-active', {
				'background-color': this.getAlphaColor(this.props.activeAlpha).hex()
			}),

			this.createElementStyles('.bg-color-background', {
				'background-color': this.getColor().hex(),
				'color': this.getInvertedColor().hex()
			}),

			this.createElementStyles('.bg-color-background-light', {
				'background-color': this.getAlphaColor(1 - 0.1).hex(), //this.getInvertedAlphaColor(1 - 0.1).hex(),
				'color': this.getInvertedColor().hex()
			}),

			this.createElementStyles('.bg-color-background-middle', {
				'background-color': this.getAlphaColor(1 - 0.25).hex(),
				'color': this.getInvertedColor().hex()
			}),

			this.createElementStyles('.bg-color-background-dark', {
				'background-color': this.getAlphaColor(1 - 0.40).hex(),
				'color': this.getInvertedColor().hex()
			}),

			// color sheme
			this.createElementStyles('.bg-color-light', {
				'color': this.getAlphaColor(0.3).hex()
			}),

			this.createElementStyles('.bg-color-middle', {
				'color': this.getAlphaColor(0.5).hex()
			}),

			this.createElementStyles('.bg-color-dark', {
				'color': this.getAlphaColor(0.7).hex()
			}),

			this.createElementStyles('.bg-color-inverted', {
				'color': this.getInvertedColor().hex()
			}),

			// border
			this.createElementStyles('.bg-border', {
				'border-color': this.getColor().hex()
			}),

			this.createElementStyles('.bg-border-inverted-light', {
				'border-color': this.getInvertedAlphaColor(0.15).hex()
			}),

			this.createElementStyles('.bg-border-inverted-middle', {
				'border-color': this.getInvertedAlphaColor(0.35).hex()
			}),

			this.createElementStyles('.bg-border-inverted-dark', {
				'border-color': this.getInvertedAlphaColor(0.55).hex()
			}),

			this.createElementStyles('.bg-border-light', {
				'border-color': this.getAlphaColor(0.15).hex()
			}),

			this.createElementStyles('.bg-border-middle', {
				'border-color': this.getAlphaColor(0.35).hex()
			}),

			this.createElementStyles('.bg-border-dark', {
				'border-color': this.getAlphaColor(0.55).hex()
			}),

			this.createElementStyles('body, a, .bg-color', {
				'color': this.getColor().hex()
			})
		]);

		return (
			<style>
				{styles}
			</style>
		)
	}

});

module.exports = BackgroundHandler;