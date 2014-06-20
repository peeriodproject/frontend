'use strict';

// disables auto init in [data-tooltip] elements
Tooltip.autoinit = false;

/**
 * A TooltipMixin enriches the Component by adding a tooltip to it. 
 * By default the mixin is using `this.props.tooltipContent` and `this.props.tooltipPosition` but you can 
 * implement your own `this.getTooltipContent()` and `this.getTooltipPosition()` methods.
 *
 * The mixin is based on the work of [Thomas Carnecky]{@link https://caurea.org/2014/06/12/tooltip-mixin-for-react.html}
 *
 * @mixin
 */
var TooltipMixin = {

	/**
	 * The internally used tooltip instance
	 *
	 * @member {Tooltip} core.tooltip.TooltipMixin~_tooltip
	 */
	_tooltip: null,
	//_isOpen: false,

	componentDidMount: function() {
		var el = this.getDOMNode();

		this._tooltip = new Tooltip({
			target		: el,
			position	: this._getTooltipOption('getTooltipPosition'),
			content		: this._getTooltipOption('getTooltipContent'),
			openOn		: null/*,
			classes		: 'my-tether-theme'*/
		});

		el.addEventListener('mouseenter', this.onMouseEnter, false);
		el.addEventListener('mouseleave', this.onMouseLeave, false);
		
	},

	_getTooltipOption: function (methodName) {
		return this[methodName] ? this[methodName]() : this['_' + methodName]();
	},

	_getTooltipContent: function () {
		return this.props.tooltipContent ? this.props.tooltipContent : '';
	},

	_getTooltipPosition: function () {
		return this.props.tooltipPosition ? this.props.tooltipPosition : 'top center';
	},

	/**
	 * Updates the tooltip content if the tooltip is open right now
	 */
	componentDidUpdate: function() {
		if (this._tooltip && this._tooltip.drop.isOpened()) {
			this.update(this._getTooltipOption('getTooltipContent'));
		}
	},

	/**
	 * Cleans up the tooltip and it's mouseenter and mouseleave events
	 */
	componentWillUnmount: function() {
		var el = this.getDOMNode();

		el.removeEventListener('mouseenter', this.onMouseEnter);
		el.removeEventListener('mouseleave', this.onMouseLeave);

		this._tooltip.destroy();
	},

	/**
	 * Opens the tooltip whenever the mouse entered the DOM node
	 */
	onMouseEnter: function() {
		this._tooltip.open();
	},

	/**
	 * Closes the tooltip whenever the mouse left the DOM node
	 */
	onMouseLeave: function() {
		this._tooltip.close();
	},

	/**
	 * Renders the tooltip content into the tooltip.drop.content 
	 *
	 * @param  {string|React.Component} content The content to render
	 */
	update: function(content) {
		var self = this;

		if (!content) {
			return;
		}
		else if (typeof content === 'string') {
			content = React.DOM.div({}, content);
		}
		
		React.renderComponent(content, this._tooltip.drop.content, function() {
			self._tooltip.drop.position();
		});	
	}
};

module.exports = TooltipMixin;