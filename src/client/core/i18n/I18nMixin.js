var sentWarningFor = [];

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
	 * @param  {string} fallback
	 *
	 * @return {string}
	 */
	i18n: function (key, fallback) {
		var value = chrome.i18n.getMessage(key);

		if (!value) {
			if (sentWarningFor.indexOf(key) === -1) {
				console.warn('i18n: No value found for key: "' + key  + '"');
				sentWarningFor.push(key);
			}
			
			value = fallback || '__' + key + '__';
		}

		return value;
	}
};

module.exports = I18nMixin;