/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var NetworkLoader = React.createClass({

	getDefaultProps: function () {
		return {
			maxNodes: 7,
			width: 200,
			height: 200
		}
	},

	componentDidMount: function () {
		this._graph = new Springy.Graph();

		this._springy = $(this.refs.networkLoader.getDOMNode()).springy({
			graph: this._graph,
			stiffness: 200.0,
			repulsion: 200.0,
			damping: 0.5,
			nodeRadius: 3,
			canvasPadding: 25,
			nodeColor: '#f0f0f0',
			edgeColor: '#a4a4a4'
		});

		this.randomizeGraph();
		this.createUpdateTimeout();
	},

	createUpdateTimeout: function () {
		var _this = this;

		this._updateTimeout = setTimeout(function () {
			_this.randomizeGraph();
			_this.createUpdateTimeout();
		}, 500);
	},

	addNode: function () {
		console.log('add Node');
		var edges = this.getEdges();
		var node = this._graph.newNode({
			label: this._graph.nodes.length + ''
		});
		
		if (edges.length) {
			for (var i = 0; i < edges.length; i++) {
				this._graph.newEdge(node, edges[i], {
					weight: 0.25
				});
			}
		}
	},

	getEdges: function () {
		if (!this._graph.nodes.length) {
			return [];
		}

		var edges = Math.min(this._graph.nodes.length, Math.ceil(Math.random() * 3));
		//+ Jonas Raoni Soares Silva
		//@ http://jsfromhell.com/array/shuffle [v1.0]
		var shuffle = function shuffle(o){ //v1.0
			for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
			return o;
		};

		return (shuffle(this._graph.nodes.slice())).splice(edges);
	},

	removeNode: function () {
		console.log('remove node');
		var node = this._graph.nodes.shift();
		this._graph.removeNode(node);
	},

	randomizeGraph: function () {
		console.log(this._graph.nodes.length);
		if (this._graph.nodes.length < this.props.maxNodes / 2) {
			this.addNode();
		} 
		else {
			var rand = Math.random();
			console.log(rand);
			if (this._graph.nodes.length < this.props.maxNodes && rand >= 0.5) {
				this.addNode();
			}
			else {
				this.removeNode();
			}
		}
	},

	componentWillUnmount: function () {
		if (this._updateTimeout) {
			clearTimeout(this._updateTimeout);
			this._updateTimeout = null;
		}
	},

	render: function () {
		return (
			<div className='network-loader-wrapper'>
				<canvas ref='networkLoader' className='network-loader' width={this.props.width} height={this.props.height}></canvas>
			</div>
		)
	}

});

module.exports = NetworkLoader;