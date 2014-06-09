/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Link = require('react-router-component').Link;
var Async = require('react-async');

var FooPage = React.createClass({

  mixins: [Async.Mixin],

  getInitialStateAsync: function(cb) {
    var username = this.props.username;

    setTimeout(function () {
      cb(null, {message: 'foo page ' + username});
    }, 200);
  },

  render: function() {
    return (
      <div>
        <p><Link href='/'>Return</Link></p>
        <div>{this.state.message}</div>
      </div>
    )
  }
});

module.exports = FooPage;