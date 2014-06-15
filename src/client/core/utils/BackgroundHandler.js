/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var BackgroundHandler = React.createClass({

	getInitialState: function() {
		return {
			secondsElapsed: 0,
			color: '#fff'
		};
	},

	tick: function() {
		this.setState({secondsElapsed: this.state.secondsElapsed + 1});
	},

	componentDidMount: function() {
		this.interval = setInterval(this.tick, 1000);
	},

	componentWillUnmount: function() {
		clearInterval(this.interval);
	},

	getBackgroundColor: function () {
		return {
			r: 0,
			g: 0,
			b: 0
		};
	},

	createElementStyles: function (selector, styles) {
		var keys = Object.keys(styles);
		var style = [];
		
		for (var i = 0, l = keys.length; i < l; i++) {
			var key = keys[i];
			style.push(key + ': ' + styles[key]);
		}

		return selector + ' {\n\t' + style.join(';\n\t') + '\n}';
	},

	createStyles: function (styles) {
		return styles.join('\n');
	},

	render: function () {
		//var wrapper = '#wrapper { background-color: ; }';
		var styles = this.createStyles([
			this.createElementStyles('#wrapper', {
				'background-color': 'hsl(' + (this.state.secondsElapsed % 255) +  ', 60%, 20%)'
			}),

			this.createElementStyles('body, a', {
				color: this.state.color
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