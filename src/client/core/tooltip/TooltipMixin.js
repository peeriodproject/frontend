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

	componentWillMount: function () {
		this._tooltip = null;
	},

	componentDidMount: function() {
		var el = this._getTooltipOption('getTooltipElement');
		var extraClassName = this._getTooltipOption('getTooltipClassName');

		if (!this.props.tooltipContent && !this.props.enableTooltip) {
			return;
		}

		this._tooltip = new Tooltip({
			target		: el,
			position	: this._getTooltipOption('getTooltipPosition'),
			content		: '',
			openOn		: null,
			classes		:'tooltip-theme-arrows' + (extraClassName ? ' ' + extraClassName : extraClassName),
			constrainToScrollParent: false,
			constrainToWindow: true,
			tetherOptions: {
				/*optimizations: {
					moveElement: false
				}*/
				 constraints: [{
					to: 'window',
					pin: true,
					attachment: 'together'
				}],
				offset: this._getTooltipOption('getTooltipOffset')
			}
			/*classes		: 'my-tether-theme'*/
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

	_getTooltipClassName: function () {
		return this.props.tooltipClassName ? this.props.tooltipClassName : '';
	},

	_getTooltipOpenClass: function () {
		return this.props.tooltipOpenClass ? this.props.tooltipOpenClass : '';
	},

	_getTooltipOffset: function () {
		return this.props.tooltipOffset ? this.props.tooltipOffset : '0 0';
	},

	_getTooltipElement: function () {
		return this.getDOMNode();
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

		if (!this._tooltip) {
			return;
		}
		
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

		this.update(this._getTooltipOption('getTooltipContent'));

		if (this.props.onTooltipOpen) {
			this.props.onTooltipOpen();
		}
	},

	toggleTooltip: function () {
		if (!this._tooltip || !this._tooltip.drop.isOpened()) {
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
		if (this._tooltip) {
			this._tooltip.close();
		}

		this.setState({
			tooltipOpenClass: ''
		});

		if (this.props.onTooltipClose) {
			this.props.onTooltipClose();
		}
	},

	getTooltipDrop: function () {
		return this._tooltip ? this._tooltip.drop.drop : null;
	},

	/**
	 * Renders the tooltip content into the tooltip.drop.content 
	 *
	 * @param  {string|React.Component} content The content to render
	 */
	update: function(content) {
		var self = this;

		if (!content || !this._tooltip) {
			return;
		}
		else if (typeof content === 'string') {
			content = React.DOM.div({}, content);
		}
		
		React.renderComponent(content, this._tooltip.drop.content, function() {
			self._tooltip.drop.position()
		});	
	},

	updateTooltipPosition: function () {
		if (this._tooltip && this._tooltip.drop.isOpened()) {
			this._tooltip.drop.position();
		}
	}
};

module.exports = TooltipMixin;