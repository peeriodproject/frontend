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
		return chrome.i18n.getMessage(key);
	}
};

module.exports = I18nMixin;