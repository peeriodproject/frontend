/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');

var SvgIcon = require('../element/SvgIcon');
var ExternalUrl = require('../utils/ExternalUrl');

var Footer = React.createClass({
	
	mixins: [
		I18nMixin
	],

	render: function () {
		return (
			<div className='inner-footer'>
				<section>
					<div>
						2014 <span className='seperator'>{'\u00B7'}</span> <ExternalUrl name='home' />
					</div>
					<div>
						<SvgIcon icon='logo' />
					</div>
					<div>
						<ExternalUrl name='contactUs' />
					</div>
				</section>
			</div>
		)
	}
});

module.exports = Footer;