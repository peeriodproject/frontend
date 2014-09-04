'use strict';

var ChannelMixin = {

	_setupChannel: function (name) {
		var self = this;
		var channelName = this.getChannelName(name);
		var onCallback = function () {
			var args = arguments || [];

			// add channelName as first argument
			Array.prototype.unshift.call(args, name);

			self.onChannelUpdate.apply(this, args);
		};

		this[channelName] = this.getChannel(name);

		this[channelName].on('update', onCallback);
		this[channelName].send('getInitialState', onCallback);

		this._onChannelCallbacks[channelName] = onCallback;
	},

	getChannelName: function (name) {
		return name + 'Channel';
	},

	getChannel: function (channelName) {
		return window.socket.channel(channelName);
	},

	firstCharToUpperCase: function (str) {
		return str ? str[0].toUpperCase() + str.slice(1) : '';
	},

	getInitialState: function () {
		return this.initialChannelsState;
	},

	gotInitialState: function (channelName) {
		return this._gotInitialChannelState[channelName] ? true : false;
	},

	gotStateClassName: function (channelName) {
		return this._gotInitialChannelState[channelName] ? ' got-' + channelName + '-channel-state' : '';
	},

	gotStateClassNames: function () {
		var classNames = '';
		var channelNames = Object.keys(this._gotInitialChannelState);

		if (!channelNames.length) {
			return '';
		}

		for (var i = 0, l = channelNames.length; i < l; i++) {
			classNames += this.gotStateClassName(channelNames[i]);
		}

		return classNames;
	},

	onChannelUpdate: function () {
		var args = arguments;
		var channelName = args[0];
		var channelUpdateName = 'update' + this.firstCharToUpperCase(channelName) + 'ChannelState';

		if (!this._gotInitialChannelState[channelName]) {
			this._gotInitialChannelState[channelName] = true;
		}

		if (this[channelUpdateName]) {
			// remove channelName from args
			Array.prototype.shift.call(args);

			this[channelUpdateName].apply(this, args);
		}
		else {
			if (this.updateChannelState) {
				this.updateChannelState.apply(this, args);
			}
			else if (console) {
				console.warn('no channel update method for ' + channelUpdateName + ' implemented');
			}
		}
	},

	componentWillMount: function () {
		var self = this;

		this._channels = [];
		this._onChannelCallbacks = {};
		this._gotInitialChannelState = {};

		if (!this.channelNames || !this.channelNames.length) {
			if (console) {
				console.error('no channel names specified!');
			}
			return;
		}

		for (var i = 0, l = this.channelNames.length; i < l; i++) {
			this._setupChannel(this.channelNames[i]);
		}
	},

	componentWillUnmount: function () {
		for (var i = 0, l = this.channelNames.length; i < l; i++) {
			var channelName = this.getChannelName(this.channelNames[i]);

			if (this[channelName]) {
				this[channelName].off('update', this._onChannelCallbacks[channelName]);
			}
		};
	}

};

module.exports = ChannelMixin;