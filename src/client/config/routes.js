module.exports = [
	{
		path: '/',
		handler: require('../core/index/IndexHandler')
	},
	{
		path: '/foo/:username',
		handler: require('../core/foo/FooHandler')
	},
	{
		path: '/folders/:folder',
		handler: require('../core/settings/SharedFoldersHandler')
	}
];