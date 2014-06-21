/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var ChannelMixin = require('../socket/ChannelMixin');

var NetworkSpeedChart = React.createClass({

	_inverval: null,
	_svg: null,

	getDefaultProps: function () {
		return {
			n			: 243,
			duration	: 750
		};
	},

	getInitialState: function () {
		return {
			width: 100,
			height: 100,
			upload: 0,
			download: 0
		};
	},

	componentWillMount: function () {
		this._now = new Date(Date.now() - this.props.duration);
	},

	componentDidMount: function () {
		var self = this;

		window.addEventListener('resize', this.handleResize);
		this.handleResize();

		this._svg = d3.select(this.getDOMNode());

		this._x = d3.time.scale()
			.domain([this._now - (this.props.n - 2) * this.props.duration, this._now - this.props.duration])
			.range([0, this.state.width]);

		this._y = d3.scale.linear()
			.range([this.state.height, 0]);

		this._line = d3.svg.line()
			.interpolate('basis')
			.x(function(d, i) { return self._x(self._now - (self.props.n - 1 - i) * self.props.duration); })
			.y(function(d, i) { return self._y(d); });

		this._uploadData = d3.range(this.props.n).map(function() { return 0; });
		this._downloadData = d3.range(this.props.n).map(function() { return 0; });
		
		this._pathWrapper = this._svg.append('g');
		this._uploadPath = this._pathWrapper
			//.attr('clip-path', 'url(#clip)')
			.append('path')
				.data([this._uploadData])
				.attr('class', 'line upload');

		this._downloadPath = this._pathWrapper
			.append('path')
				.data([this._downloadData])
				.attr('class', 'line download');

		this.tick();
		
		// dummy data generator
		setInterval(function () {
			self.setState({
				upload: Math.random() * 256,
				download: Math.random() * 1024
			});
		}, 1000);
	},

	componentWillUnmount: function() {
		window.removeEventListener('resize', this.handleResize);
	},

	handleResize: function () {
		var el = this.getDOMNode();

		if (el) {
			this.setState({
				width: el.offsetWidth,
				height: el.offsetHeight
			});
		}
	},

	tick: function () {
		// update the domains
		this._now = new Date();
		this._x.domain([this._now - (this.props.n - 2) * this.props.duration, this._now - this.props.duration]);
		this._y.domain([0, Math.max(d3.max(this._downloadData), d3.max(this._uploadData))]);

		// push the accumulated count onto the back, and reset the count
		this._uploadData.push(this.state.upload);
		this._downloadData.push(this.state.download);

		this._pathWrapper.attr('transform', null);

		// redraw the line
		this._uploadPath.attr('d', this._line);
		this._downloadPath.attr('d', this._line);

		// slide the line left
		this._pathWrapper.transition()
			.duration(this.props.duration)
			.ease('linear')
			.attr('transform', 'translate(' + this._x(this._now - (this.props.n - 1) * this.props.duration) + ')')
			.each('end', this.tick);

		// pop the old data point off the front
		this._uploadData.shift();
		this._downloadData.shift();
	},

	render: function () {
		if (this._x) {
			this._x.range([0, this.state.width]);
		}

		if (this._y) {
			this._y.range([this.state.height, 0]);
		}

		return (
			<svg width={this.state.width} height={this.state.height} className='network-speed-chart'></svg>
		)
	}

});

module.exports = NetworkSpeedChart;
