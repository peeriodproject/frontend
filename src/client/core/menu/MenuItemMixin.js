var MenuItemMixin = {
	
	onClick: function (e) {
		if (!this.refs.Link) {
			//console.warn('You have added the "MenuItemMixin" but forgot to set a "this.refs.Link" reference');
			return;
		}

		this.refs.Link.getDOMNode().click();
	}

};

module.exports = MenuItemMixin;