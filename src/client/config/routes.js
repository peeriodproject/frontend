module.exports = [
	{
		path: '/',
		handler: require('../core/index/IndexHandler')
	},
	{
		path: '/folders(/:folder)',
		handler: require('../core/settings/SharedFoldersHandler')
	},
	{
		path: '/search(/:query)',
		handler: require('../core/search/SearchHandler')
	},
	{
		path: '/share',
		handler: require('../core/share/ShareHandler')
	},
	{
		path: '/status',
		handler: require('../core/status/AppStatusHandler')
	},
	{
		path: '/welcome',
		handler: require('../core/welcome/WelcomeHandler')
	}
];