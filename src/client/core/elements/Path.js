/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var Path = React.createClass({

	getDefaultProps: function () {
		return {
			path: '',
			seperator: '/',
			filenameClassName: 'filename'
		}
	},

	/**
	 * Returns the path wraps the last segment in a <span class="this.props.filenameClassName">
	 *
	 * @return {sting}
	 */
	getPath: function () {
		return this.props.path + '<span class="' + this.props.filenameClassName + '">' + this.props.seperator + this.props.name + '</span>';
	},

	/**
	 * Activates the jQuery.dotdotdot plugin
	 */
	componentDidMount: function () {
		this.$node = $(this.getDOMNode());

		this.$node.height(this.$node.height()).dotdotdot({
			after: '.' + this.props.filenameClassName,
			wrap: 'letter',
			watch: true,
			ellipsis: '...'
		});
	},

	/**
	 * Cleans up the jQuery.dotdotdot plugin
	 */
	componentWillUnmount: function () {
		this.$node.trigger('destroy');
	},

	/**
	 * Updates the path property by removing the last segment and makes it availables under the props.name key.	 * 
	 */
	setupPath: function () {
		var seperator = this.props.seperator;
		var path = this.props.path.split(seperator);
		var name = path.pop();

		this.props.path = path.join(seperator);
		this.props.name = name;
	},

	/**
	 * Renders the path inside a div.path element
	 */
	render: function (argument) {
		this.setupPath();
		
		return (
			<div className="path" dangerouslySetInnerHTML={{ __html: this.getPath() }}></div>
		)
	}
});

module.exports = Path;