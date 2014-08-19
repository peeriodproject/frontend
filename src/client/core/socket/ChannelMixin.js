'use strict';

var ChannelMixin = {

	_channels: [],
	_onChannelCallbacks: {},
	_gotInitialChannelState: {},

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
		var self = this;

		if (!this.channelNames || !this.channelNames.length) {
			if (console) {
				console.error('no channel names specified!');
			}
			return;
		}

		for (var i = 0, l = this.channelNames.length; i < l; i++) {
			this._setupChannel(this.channelNames[i]);
		}

		return this.initialChannelsState;
	},

	gotInitialState: function (channelName) {
		return this._gotInitialChannelState[channelName] ? true : false;
	},

	gotStateClassName: function (channelName) {
		return this._gotInitialChannelState[channelName] ? ' got-' + channelName + '-channel-state' : '';
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
			this.updateChannelState.apply(this, args);
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