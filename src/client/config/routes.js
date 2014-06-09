module.exports = [
	{
		path: '/',
		handler: require('../core/index/IndexHandler')
	},
	{
		path: '/foo/:username',
		handler: require('../core/foo/FooHandler')
	}
];