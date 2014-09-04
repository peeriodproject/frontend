//var countdown = require('countdown');
var moment = require('moment');

var DownloadMixin = {

	_updateTimeout: null,

	statics: {
		/**
		 * Returns the given size in a human readable format
		 *
		 * @param  {number} bytes The number of bytes
		 *
		 * @return {string}       The formatted size with extension
		 */
		getSizeWithExtension: function (bytes) {
			if (bytes === 0) {
				return '0 Byte';
			}

			var k = 1024;
			var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
			var i = Math.floor(Math.log(bytes) / Math.log(k));

			return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
		},
	},

	getDefaultProps: function () {
		return {
			created		: 0,
			id			: '',
			loaded		: 0,
			name		: '',
			size		: 0,
			status		: ''
		};
	},

	getInitialState: function () {
		return {
			averageSpeed: 0,
			now: 0,
			timeLeft: 0
		};
	},

	/*componentDidMount: function () {
		this.calcTimeAndSpeed();

		this._startUpdateTimeout();
	},*/

	// @see http://stackoverflow.com/a/7312237
	componentWillReceiveProps: function (nextProps) {
		this.calcTimeAndSpeed(nextProps);
	},

	/*componentWillUnmount: function () {
		if (this._updateTimeout) {
			clearTimeout(this._updateTimeout);
		}
	},*/

	/*_startUpdateTimeout: function () {
		var _this = this;

		if (this._updateTimeout) {
			clearTimeout(this._updateTimeout);
			this._updateTimeout = null;
		}

		this._updateTimeout = setTimeout(function () {
			_this.calcTimeAndSpeed();
			_this._startUpdateTimeout();
		}, 200);
	},*/

	/**
	 * Returns the progress as a decimal value 0 <= i <= 1
	 *
	 * @returns {number} the state of the download progress
	 */
	getProgress: function () {
		var prog = (this.props.loaded / this.props.size);

		return prog;
	},

	calcTimeAndSpeed: function (props) {
		props = props || this.props;

		var now = new Date().getTime();
		var timeElapsed = now - this.props.created;
		var speed = this.props.loaded / timeElapsed;
		var timeLeft = (this.props.size - this.props.loaded) / speed;

		this.setState({
			timeLeft: timeLeft,
			now: now,
			averageSpeed: this.getAverageSpeed(speed * 1000) // ms to s
		});
	},

	// @see http://stackoverflow.com/a/3841706
	getAverageSpeed: function (lastSpeed) {
		var SMOOTHING_FACTOR = 0.45;
		
		// exponential moving average
		return SMOOTHING_FACTOR * lastSpeed + (1 - SMOOTHING_FACTOR) * this.state.averageSpeed;
	},

	convertTime: function () {
		var timeLeftInSeconds = this.state.timeLeft;

		if (!timeLeftInSeconds) {
			return {};
		}
		
		return {
			years	: Math.round(moment.duration(timeLeftInSeconds, 'milliseconds').years()),
			months	: Math.round(moment.duration(timeLeftInSeconds, 'milliseconds').months()),
			days	: Math.round(moment.duration(timeLeftInSeconds, 'milliseconds').days()),
			hours	: Math.round(moment.duration(timeLeftInSeconds, 'milliseconds').hours()),
			minutes	: Math.round(moment.duration(timeLeftInSeconds, 'milliseconds').minutes()),
			seconds	: Math.round(moment.duration(timeLeftInSeconds, 'milliseconds').seconds())
		};
	},

	/**
	 * Returns the human readable estimated download duration without seconds.
	 * If the remaining duration is less than a minute it returns 'less than a minute' or 'a few seconds'
	 */
	humanize: function (time) {
		var o = '';

		console.log(JSON.stringify(time));

		var keys = Object.keys(time);
		var key = '';
		var remaining = this._getI18nString('downloadMixin_remaining', 'remaining');

		if (!keys.length) {
			return '';
		}

		for (var i = 0, l = keys.length; i < l; i++) {
			key = keys[i];

			if (time[key] && time[key] > 0) {
				var i18nKey = this._isSingular(time[key]) ? this._getI18nString('downloadMixin_' + key + '_singular', key) : this._getI18nString('downloadMixin_' + key + '_plural', key);

				if (o === '') {
					o += this._getI18nString('downloadMixin_about', 'About') + ' ';
					o += time[key] + ' ' + i18nKey + ' ';

					if (key === 'minutes') {
						return o + remaining;
					}
				}
				else {
					return o + this._getI18nString('downloadMixin_and', 'and') + ' ' + time[key] + ' ' + i18nKey + ' ' + remaining;
				}
			}
		}

		// extra humanzier for less than a minute
		if (key === 'seconds') {
			if (!isNaN(time[key])) {
				if (time[key] > 30) {
					return this._getI18nString('downloadMixin_lessThanAMinute', 'less than a minute') + ' ' + remaining;
				}
				else {
					return this._getI18nString('downloadMixin_aFewSeconds', 'a few seconds') + ' ' + remaining;
				}
			}
			else {
				return this._getI18nString('downloadMixin_calculatingDuration', '');
			}
		}

		return '';
	},

	_isSingular: function (value) {
		return value <= 1 ? true : false;
	},

	_getI18nString: function (key, fallback) {
		return this.i18n ? this.i18n(key) : fallback;
	},

	// @see https://stackoverflow.com/questions/14157341/how-can-i-humanize-this-complete-duration-in-moment-js-javascript
	getTimeLeft: function () {
		var timeLeft = this.humanize(this.convertTime());
		console.log(timeLeft);

		return timeLeft;
	}

};

module.exports = DownloadMixin;