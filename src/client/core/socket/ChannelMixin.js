var ChannelMixin = {

	getChannel: function (channelName) {
		return window.socket.channel(channelName);
	},

	getInitialState: function () {
		if (!this.channelName) {
			console.error('no channel name specified!');
		}

		if (!this.updateChannelState) {
			console.error('no updateChannelState method implemented');
		}

		if (!this.initialState) {
			console.error('no initial state specified!');
		}

		this.channel = this.getChannel(this.channelName);
 
		this.channel.on('update', this.updateChannelState);
		this.channel.send('getInitialState', this.updateChannelState);

		return this.initialState;
	}

};

module.exports = ChannelMixin;