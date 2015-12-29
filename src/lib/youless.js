'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var request = require('request');

var INTERVAL = 30;

var currentValues = {};

var Youless = assign({}, EventEmitter.prototype, {
    "connect": function (addr) {
        var that = this;

        var fetch = function () {
            request({
                url: 'http://' + addr + '/a?h=1&f=j',
                json: true,
                timeout: 2000
            }, function (error, response, data) {
                var changes = {};
                if (!error && response.statusCode === 200) {
                    data.cnt = parseFloat(data.cnt.replace(',', '.'));
                    var match = /\(&plusmn;(.+)%\)/.exec(data.dev);
                    data.dev = parseInt(match[1]);

                    Object.keys(data).forEach(function(key) {
                        switch (key) {
                            case 'det':
                            case 'sts':
                            case 'raw':
                                // do nothing
                                break;
                            default:
                                if (!currentValues[key] || currentValues[key] !== data[key]) {
                                    currentValues[key] = data[key];
                                    changes[key] = data[key];
                                }
                                break;
                        }
                    });
                    that.emit('data', JSON.stringify(changes));
                }
            })
        };

        fetch();
        setInterval(fetch, INTERVAL * 1000);
        this.emit('connect');
    }
});

module.exports = Youless;
