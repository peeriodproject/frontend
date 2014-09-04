/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var Dropzone = React.createClass({

	getDefaultProps: function () {
		return {
			onDrop: function () {}
		};
	},

	componentDidMount: function () {
		var self = this;
		
		this.$node = $(this.getDOMNode());

		this.$node
			.on('dragover', function (evt) {
				evt.preventDefault();
			})
			.on('dragenter', function () {
				$(this).addClass('bg-color-background-light');
  				
			})
			.on('dragleave', function () {
  				self.cleanup();
			})
			.on('drop', function (evt) {
  				evt.preventDefault();
  				//console.log(evt.originalEvent.dataTransfer);
  				//debugger;

  				var files = evt.originalEvent.dataTransfer.items;
  				self.props.onDrop(files);

  				self.cleanup();
			});
	},

	cleanup: function () {
		$(this).removeClass('bg-color-background-light');
	},

	componentWillUnmount: function () {
		this.cleanup();
		this.$node.off('dragover drop');
	},

	render: function () {
		return (
			<div className='dropzone bg-border-dark'>Drop!</div>
		)
	}

});

module.exports = Dropzone;