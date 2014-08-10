var sentWarningFor = [];

var Interpolate = require('react-interpolate-component');

/**
 * provides internationalisation via chrome.i18n
 *
 * @type {Object}
 */
var I18nMixin = {

	/**
	 * Returns the localized string for the specified key
	 *
	 * @param  {string} key
	 *
	 * @return {string}
	 */
	i18n: function (key, placeholders) {
		var placeholderMap = {};
		var chromePlaceholders;
		var value;

		placeholders = placeholders || [];

		if (placeholders.length) {
			chromePlaceholders = [];

			for (var i = 0, l = placeholders.length; i < l; i++) {
				var placeholderKey = 'placeholder-' + i;

				placeholderMap[placeholderKey] = placeholders[i];
				chromePlaceholders[i] = '%(' + placeholderKey + ')s';
			}
		}

		value = chrome.i18n.getMessage(key, chromePlaceholders);

		if (!value) {
			if (sentWarningFor.indexOf(key) === -1) {
				console.warn('i18n: No value found for key: "' + key  + '"');
				sentWarningFor.push(key);
			}
			
			return  '__' + key + '__';
		}
		
		return chromePlaceholders && chromePlaceholders.length ? Interpolate(placeholderMap, value) : value;
	}
};

module.exports = I18nMixin;