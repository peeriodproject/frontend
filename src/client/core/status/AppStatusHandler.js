/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');
var ChannelMixin = require('../socket/ChannelMixin');

var Badge = require('../element/Badge');
var SvgIcon = require('../element/SvgIcon');

var AppStatusHandler = React.createClass({

	mixins: [
		I18nMixin,
		ChannelMixin
	],

	channelNames: [
		'protocol'
	],

	initialChannelsState: {
		protocolState: {}
	},

	updateProtocolChannelState: function (state) {
		this.setState({
			protocolState: state
		});
	},

	getTopologyStats: function () {
		var stats = [];
		var keys = [
			'foundEntryNode',
			'initialContactQueryComplete',
			'topologyJoinComplete'
		];

		for (var i = 0, l = keys.length; i < l; i++) {
			var key = keys[i];
			var enabled = this.state.protocolState[key];
			var icon = enabled ? 'tick' : 'close';
			var label = enabled ? 'valid' : 'invalid';

			var li = (
				<li key={stats.length} className={'is-' + label}>
					<SvgIcon icon={icon} /> {this.i18n('appStatus_topology_' + key + '_' + label + '_title')}
				</li>
			)
			
			stats.push(li);
		}

		return stats;
	},

	getHydraStats: function () {
		var stats = [];
		var numOfHydraCircuitsLabel = 'appStatus_hydra_noHydraCircuits_title';
		var placeholders;
		var badgeClassName = '';
		var desiredAmountOfCircuitsReached = this.state.protocolState.desiredAmountOfCircuits && this.state.protocolState.numOfHydraCircuits === this.state.protocolState.desiredAmountOfCircuits;
		var reachedIcon = desiredAmountOfCircuitsReached ? 'tick' : 'close';
		var reachedLabel = desiredAmountOfCircuitsReached ? 'valid' : 'invalid';
		var hasHydrasIcon = this.state.protocolState.numOfHydraCircuits ? 'tick' : 'close';
		var hasHydraClassName = this.state.protocolState.numOfHydraCircuits ? 'valid' : 'invalid';

		// num of circuits reached
		if (desiredAmountOfCircuitsReached) {
			badgeClassName = 'status-valid';
			placeholders = [
				<Badge label={this.state.protocolState.numOfHydraCircuits} className={badgeClassName} />
			];
		}
		else {
			badgeClassName = !this.state.protocolState.numOfHydraCircuits ? 'status-invalid' : '';
			
			placeholders = [
				<Badge className={badgeClassName}>
					{this.state.protocolState.numOfHydraCircuits}/{this.state.protocolState.desiredAmountOfCircuits}
				</Badge>
			];
		}
		
		if (this.state.protocolState.numOfHydraCircuits === 1) {
			numOfHydraCircuitsLabel = 'appStatus_hydra_numOfHydraCircuits_singular_title';
		}
		else if (this.state.protocolState.numOfHydraCircuits > 1) {
			numOfHydraCircuitsLabel = 'appStatus_hydra_numOfHydraCircuits_plural_title';
		}

		// reached
		//desiredAmountOfCircuitsReached

		stats.push(
			<li key={stats.length} className={'is-' + hasHydraClassName + ' ' + badgeClassName}>
				<SvgIcon icon={hasHydrasIcon} /> {this.i18n(numOfHydraCircuitsLabel, placeholders)}
			</li>
		);

		stats.push(
			<li key={stats.length} className={'is-' + reachedLabel}>
				<SvgIcon icon={reachedIcon} /> {this.i18n('appStatus_hydra_desiredAmountOfCircuitsReached_' + reachedLabel + '_title')}
			</li>
		)
		
		return stats;
	},

	getProxyStats: function () {
		var needsProxy = this.state.protocolState.needsProxy;
		var needsProxyLabel = needsProxy ? 'appStatus_proxy_needsProxyAndHasNumOfProxies_title' : 'appStatus_proxy_needsNoProxyAndIsProxyingFor_title';
		var proxyCount = needsProxy ? this.state.protocolState.numOfProxies : this.state.protocolState.numOfProxyingFor;
		var badgeClassName = '';
		
		proxyCount = proxyCount || 0;

		if (needsProxy) {
			badgeClassName = !proxyCount ? 'status-invalid' : 'status-valid';
		}
		else if (proxyCount) {
			badgeClassName = 'status-valid';
		}

		return (
			<div>
				{this.i18n(needsProxyLabel, [
					<Badge label={proxyCount} className={badgeClassName} />
				])}
			</div>
		)
	},

	render: function () {
		var stats = null;
		
		if (this.gotInitialState('protocol')) {
			stats = (
				<div className='stats-wrapper animated fadeIn'>
					<div className='stats'>
						<h2>{this.i18n('appStatus_topology_title')}</h2>

						<ul>
							{this.getTopologyStats()}
						</ul>
					</div>

					<div className='stats'>
						<h2>{this.i18n('appStatus_hydra_title')}</h2>

						<ul>
							{this.getHydraStats()}
						</ul>
					</div>

					<div className='stats'>
						<h2>{this.i18n('appStatus_proxy_title')}</h2>

						{this.getProxyStats()}
					</div>
				</div>
			)
		}

		return (
			<section className='app-status-handler'>
				<header>
					<h1>{this.i18n('appStatus_title')}</h1>
				</header>

				{stats}
			</section>
		)
	}
});

module.exports = AppStatusHandler;