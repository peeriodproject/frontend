var RetinaMixin = {

	getClosestImageSize: function () {
		if (this.props.imageSizes) {

		}
	},

	getRetinaImage: function (fileName, appendix) {
		var fileNameParts;

		if (!this.isRetina()) {
			return fileName;
		}

		fileNameParts = fileName.split('.');

		appendix = appendix || '@2x';

		if (fileNameParts.length <= 1) {
			return fileName + appendix;
		}

		fileNameParts[fileNameParts.length - 2] += appendix;

		return fileNameParts.join('.');
	},

	/**
	 * Retina check 
	 *
	 * @see https://github.com/imulus/retinajs/blob/master/src/retina.js#L53
	 */
	isRetina: function () {
		var root = (typeof exports === 'undefined' ? window : exports);
		var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';

        if (root.devicePixelRatio > 1) {
            return true;
        }

        if (root.matchMedia && root.matchMedia(mediaQuery).matches) {
            return true;
        }

        return false;
	}

};

module.exports = RetinaMixin;