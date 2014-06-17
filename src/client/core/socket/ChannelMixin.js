var ChannelMixin = {

	_channels: [],

	_setupChannel: function (name) {
		var self = this;
		var channelName = name + 'Channel';
		var onCallback = function () {
			var args = arguments || [];

			// add channelName as first argument
			Array.prototype.unshift.call(args, name);

			self.onChannelUpdate.apply(this, args);
		};

		this[channelName] = this.getChannel(name);

		this[channelName].on('update', onCallback);
		this[channelName].send('getInitialState', onCallback);
	},

	getChannel: function (channelName) {
		return window.socket.channel(channelName);
	},

	firstCharToUpperCase: function (str) {
		return str ? str[0].toUpperCase() + str.slice(1) : '';
	},

	getInitialState: function () {
		var self = this;

		if (!this.channelNames) {
			console.error('no channel names specified!');
			return;
		}

		for (var i = 0, l = this.channelNames.length; i < l; i++) {
			this._setupChannel(this.channelNames[i]);
		};

		return this.initialChannelsState;
	},

	onChannelUpdate: function () {
		var args = arguments;
		var channelUpdateName = 'update' + this.firstCharToUpperCase(args[0]) + 'ChannelState';

		if (this[channelUpdateName]) {
			// remove channelName from args
			Array.prototype.shift.call(args);

			this[channelUpdateName].apply(this, args);
		}
		else {
			this.updateChannelState.apply(this, args);
		}
	}

};

module.exports = ChannelMixin;