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

		if (!this.props.tooltipContent && !this.props.enableTooltip) {
			return;
		}

		this._tooltip = new Tooltip({
			target		: el,
			position	: this._getTooltipOption('getTooltipPosition'),
			content		: '',
			openOn		: null/*,
			classes		: 'my-tether-theme'*/
		});

		if (!this.props.tooltipOpenOn || this.props.tooltipOpenOn === 'hover') {
			el.addEventListener('mouseenter', this.openTooltip, false);
			el.addEventListener('mouseleave', this.closeTooltip, false);
		}
		else if (this.props.tooltipOpenOn === 'click') {
			el.addEventListener('click', this.toggleTooltip, false);
		}
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

	_getTooltipOpenClass: function () {
		return this.props.tooltipOpenClass ? this.props.tooltipOpenClass : '';
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

		el.removeEventListener('mouseenter', this.openTooltip);
		el.removeEventListener('mouseleave', this.closeTooltip);
		el.removeEventListener('click', this.toggleTooltip);

		// todo remove temporary typo fix
		if (this._tooltip.destory) {
			this._tooltip.destory();
		}
		else {
			this._tooltip.destroy();
		}
	},

	tooltipIsOpen: function () {
		return (this._tooltip && this._tooltip.drop.isOpened());
	},

	/**
	 * Opens the tooltip
	 */
	openTooltip: function() {
		this.setState({
			tooltipOpenClass: ' ' + this._getTooltipOption('getTooltipOpenClass')
		});

		this._tooltip.open();

		if (this.props.onTooltipOpen) {
			this.props.onTooltipOpen();
		}
	},

	toggleTooltip: function () {
		if (!this._tooltip.drop.isOpened()) {
			this.update(this._getTooltipOption('getTooltipContent'));
			this.openTooltip();
		}
		else {
			this.closeTooltip();
		}
	},

	/**
	 * Closes the tooltip whenever the mouse left the DOM node
	 */
	closeTooltip: function() {
		this._tooltip.close();

		this.setState({
			tooltipOpenClass: ''
		});

		if (this.props.onTooltipClose) {
			this.props.onTooltipClose();
		}
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