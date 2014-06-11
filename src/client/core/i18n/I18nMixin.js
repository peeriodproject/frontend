/**
 * provides internationalisation via chrome.i18n
 *
 * @type {Object}
 */
var I18nMixin = {

	/**
	 * Returns the localized string for the specified key
	 *
	 * @param  {strinf} key
	 *
	 * @return {string}
	 */
	i18n: function (key) {
		var value = chrome.i18n.getMessage(key);

		if (!value) {
			console.warn('i18n: No value found for key: "' + key  + '"');
			value = '__' + key + '__';
		}

		return value;
	}
};

module.exports = I18nMixin;