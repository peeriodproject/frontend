/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var TextResult = React.createClass({

	getDefaultProps: function () {
		return {
			fields: {},
			response: {}
		};
	},

	transformHighlight: function (content) {
		return content;
		//return content.replace('<em>', <em>).replace('</em>', </em>);
	},

	getFieldName: function (key) {
		return this.props.fields[key];
	},

	getField: function (fieldName) {
		return this.props.response.highlight[fieldName] ? this.transformHighlight(this.props.response.highlight[fieldName]) : this.props.response._source[fieldName];
	},

	getContent: function () {
		return this.getField(this.getFieldName('content'));
	},

	getTitle: function () {
		return this.getField(this.getFieldName('title'));
	},

	render: function () {
		return (
			<section className='text-result'>
				<h1 dangerouslySetInnerHTML={{__html: this.getTitle() }} />
				<p dangerouslySetInnerHTML={{__html: this.getContent() }} />
			</section>
		);
	}
});

module.exports = TextResult;