(function () {
	'use strict';

	var startSearch = function (value) {
		if (value) {
			chrome.runtime.sendMessage({
				type: 'startQuery',
				value: value
			});
		}
	};

	var startSearchFromOmnibox = function (text) {
		console.log('starting search from omnibox');
		if (text) {
			startSearch(text);
			console.log('started');
		}
	};

	var startSearchFromSelection = function (info, tab) {
		if (info) {
			startSearch(info.selectionText);
		}
	};

	chrome.omnibox.onInputEntered.addListener(startSearchFromOmnibox);

	chrome.contextMenus.create({
		title: chrome.i18n.getMessage('contextMenu_searchSelection_title'),
		contexts:['selection'],
		onclick: startSearchFromSelection
	});

}());