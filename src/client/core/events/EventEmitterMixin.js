var EventEmitter = require('events').EventEmitter;
var globalEmitter = module.exports = new EventEmitter();

/**
 * @see https://gist.github.com/brigand/10399638
 */
module.exports.mixinFor = function (eventName, events) {
    events = events || globalEmitter;

    // "fooBar" => "FooBar"
    var pascal = eventName[0].toUpperCase() 
                      + eventName.slice(1);

    var noop = function(){};

    var mixin = {
        componentWillMount: function(){
            if (!this["on" + pascal]) {
                return;
            }

            events.on(eventName, this["on" + pascal]);

            console.log('bound to ' + "on" + pascal);
        },
        componentWillUnmount: function(){
            if (!this["on" + pascal]) {
                return;
            }

            events.off(eventName, this["on" + pascal]);

            console.log('removed from: ' + "on" + pascal);
        }
    };

    // add emit method
    mixin["emit" + pascal] = events.emit.bind(events, eventName);

    return mixin;
};
