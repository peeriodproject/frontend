/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Link = require('react-router-component').Link;
var Async = require('react-async');

var Page = React.createClass({

  mixins: [Async.Mixin],

  getInitialStateAsync: function(cb) {
    setTimeout(function () {
      cb(null, {message: 'foobar'});
    }, 200);
  },

  render: function() {
    return (
      <div>
        <p><Link href='/foo/username-state-from-url'>Login</Link></p>
        <div>{this.state.message}</div>
      </div>
    )
  }
});

module.exports = Page;