/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var NetworkLoader = React.createClass({

	getDefaultProps: function () {
		return {
			maxNodes: 8,
			width: 200,
			height: 200
		}
	},

	componentDidMount: function () {
		this._graph = new Springy.Graph();

		this._springy = $(this.refs.networkLoader.getDOMNode()).springy({
			graph: this._graph,
			stiffness: 300.0,
			repulsion: 300.0,
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

		return (shuffle(this._graph.nodes.slice())).splice(0, edges);
	},

	removeNode: function () {
		var node = this._graph.nodes.shift();
		var connectedNodeIds = [];

		this._graph.removeNode(node);
		
		// collect connected node ids
		for (var i = 0, l = this._graph.edges.length; i < l; i++) {
			var edge = this._graph.edges[i];
			
			if (connectedNodeIds.indexOf(edge.source.id) === -1) {
				connectedNodeIds.push(edge.source.id);
			}

			if (connectedNodeIds.indexOf(edge.target.id) === -1) {
				connectedNodeIds.push(edge.target.id);
			}
		}

		for (var j = 0, m = this._graph.nodes.length; j < m; j++) {
			var n = this._graph.nodes[j];

			if (n && connectedNodeIds.indexOf(n.id) === -1) {
				this._graph.removeNode(n);
			}
		}

		//console.log(this._graph.edges);
		//console.log(this._graph.nodes);

	},

	randomizeGraph: function () {
		if (this._graph.nodes.length < this.props.maxNodes / 2) {
			this.addNode();
		} 
		else {
			var rand = Math.random();
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