var BackgroundPageMessageMixin = {

	_setupMessages: function () {
		console.log(this.messages);

		if (!this.messages || !this.messages.length) {
			return;
		}

		chrome.runtime.onMessage.addListener(this._onMessage);
	},

	_cleanupMessages: function () {
		chrome.runtime.onMessage.removeListener(this._onMessage);
	},

	_onMessage: function (message, sender) {
		var type = message.type || '';

		if (!type) {
			return;
		}

		type = type.charAt(0).toUpperCase() + type.slice(1);
		console.log(type);

		if (this['on' + type + 'Message']) {
			delete message.type;

			this['on' + type + 'Message'](message, sender);
		}
	},

	sendMessage: function (message, callback) {
		chrome.runtime.sendMessage(message, callback);
	},

	componentDidMount: function	() {
		this._setupMessages();
	},

	componentWillUnmount: function () {
		this._cleanupMessages();
	}

};

module.exports = BackgroundPageMessageMixin;