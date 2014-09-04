/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var events = require('../events/EventEmitterMixin');

var Button = require('../element/Button');
var Dropzone = require('../element/Dropzone');

var I18nMixin = require('../i18n/I18nMixin');

var AddFolderDialog = React.createClass({

	mixins: [
		I18nMixin,
		events.mixinFor('dialogClose'),
		events.mixinFor('folderAdded')
	],

	handleDrop: function (items) {
		for (var i = 0, l = items.length; i < l; i++) {
			var item = items[i].webkitGetAsEntry();
			
			if (item && item.isDirectory) {

				chrome.fileSystem.getDisplayPath(item, function(path) {
    				//console.log(path);
  				});

				this.emitFolderAdded(item.fullPath);
			}
		}

		this.emitDialogClose();
	},

	handleCancel: function (e) {
		this.emitDialogClose();
	},

	render: function () {
		//console.log(this.props);

		return (
			<section className='add-folder-dialog'>
				<h1>{this.i18n('addFolder_dialog_title')}</h1>

				<Dropzone onDrop={this.handleDrop} />

				{<div className='buttons'>
					<Button label='addFolder_dialog_cancel' onClick={this.handleCancel} />
				</div>}
			</section>
		)
	}

});

module.exports = AddFolderDialog;