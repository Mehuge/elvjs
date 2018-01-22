"use strict";
/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-04-16 19:53:47
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-04-17 00:31:16
 */
Object.defineProperty(exports, "__esModule", { value: true });
var internalId = 0;
var Listener = /** @class */ (function () {
    function Listener(topic, once, callback) {
        this.fired = 0;
        this.last = 0;
        this.dead = 0;
        this.topic = topic;
        this.once = once;
        this.callback = callback;
        this.id = ++internalId;
    }
    return Listener;
}());
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        var _this = this;
        /**
         * diagnostics() - dump data to console.log
         */
        this.diagnostics = function () {
            var _loop_1 = function (key) {
                if (_this.events.hasOwnProperty(key)) {
                    var T = _this.events[key];
                    if (T) {
                        console.log('Topic ' + key + ' Listeners ' + T.count + ' Bucket ' + T.listeners.length);
                        var listeners = T.listeners;
                        listeners.forEach(function (listener, index) {
                            if (listener) {
                                console.log('Listener:'
                                    + ' topic ' + listener.topic
                                    + ' index ' + index
                                    + ' ID ' + listener.id
                                    + ' once ' + listener.once
                                    + ' callback ' + typeof (listener.callback)
                                    + ' fired ' + listener.fired
                                    + ' last ' + (new Date(listener.last)).toISOString());
                            }
                            else {
                                console.log('Listener: topic ' + key + ' Index ' + index + ' is free (null)');
                            }
                        });
                    }
                }
            };
            for (var key in _this.events) {
                _loop_1(key);
            }
        };
        this.events = {};
    }
    /**
     * addListener() is called to register a listener for a topic.
     *
     * @param topic {string}         Topic name
     * @param once {boolean}         Fire event only once (auto-unregister) [optional]
     * @param callback {function}    Handler to call when topic is fired
     */
    EventEmitter.prototype.addListener = function (topic, once, callback) {
        if (once === void 0) { once = false; }
        var T = this.events[topic] = this.events[topic] || { count: 0, listeners: [] };
        var listeners = T.listeners;
        var listener = new Listener(topic, once, callback);
        var i = listeners.indexOf(null);
        if (i === -1) {
            listeners.push(listener);
        }
        else {
            listeners[i] = listener;
        }
        T.count++;
        return listener;
    };
    /**
     * on() is called to register a listener for a topic.
     *
     * @param topic {string}         Topic name
     * @param callback {function}    Handler to call when topic is fired
     */
    EventEmitter.prototype.on = function (topic, callback) {
        return this.addListener(topic, false, callback);
    };
    /**
     * once() is called to register a listener for a topic that will
     * fire only once before being auto-removed.
     *
     * @param topic {string}         Topic name
     * @param callback {function}    Handler to call when topic is fired
     */
    EventEmitter.prototype.once = function (topic, callback) {
        return this.addListener(topic, true, callback);
    };
    /**
     * listenOnce() is an alias for once()
     */
    EventEmitter.prototype.listenOnce = function (topic, callback) {
        return this.addListener(topic, true, callback);
    };
    /**
     * removeListener() is called to deregister an existing listener
     *
     * @param listener {any}   Handle returned by previous call to addListener()
     */
    EventEmitter.prototype.removeListener = function (listener) {
        if (!listener.dead) {
            var T = this.events[listener.topic];
            if (T) {
                var listeners = T.listeners;
                if (listeners && listeners.length) {
                    for (var i = 0; i < listeners.length; i++) {
                        if (listeners[i] && listeners[i].id === listener.id) {
                            this._killListener(listeners, i);
                            return;
                        }
                    }
                }
            }
        }
    };
    /**
     * off() is an alias for removeListener
     *
     * @param listener {any}   Handle returned by previous call to addListener()
     */
    EventEmitter.prototype.off = function (listener) {
        this.removeListener(listener);
    };
    /* Called to kill a listener, and garbage collect */
    EventEmitter.prototype._killListener = function (listeners, i) {
        var listener = listeners[i];
        if (listener) {
            var T = this.events[listener.topic];
            listener.dead = Date.now();
            T.count--;
            if (T.count === 0) {
                this.events[listener.topic] = null;
            }
        }
        listeners[i] = null;
    };
    /**
     * emit() is called to pass the supplied data to the registered handlers for the topic
     *
     * @param topic {string}         Topic name
     * @param data {any}  The data being passed (depends on topic)
     */
    EventEmitter.prototype.emit = function (topic) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var T = this.events[topic];
        if (T) {
            var listeners = T.listeners;
            if (listeners && listeners.length) {
                for (var i = 0; i < listeners.length; i++) {
                    if (listeners[i]) {
                        var listener = listeners[i];
                        if (listener.once) {
                            this._killListener(listeners, i);
                        }
                        listener.last = Date.now();
                        listener.fired++;
                        listener.callback.apply(listener, params);
                    }
                }
            }
        }
    };
    /**
     * fire() is an alias for emit()
     */
    EventEmitter.prototype.fire = function (topic) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.emit.apply(this, [topic].concat(params));
    };
    /**
     * Garbage collect.
     * Cleans up internal data structure removing unused entries.
     */
    EventEmitter.prototype.gc = function () {
        var events = {};
        var _loop_2 = function (key) {
            if (this_1.events.hasOwnProperty(key)) {
                var topic = this_1.events[key];
                if (topic) {
                    events[key] = topic;
                    if (topic.count < topic.listeners.length) {
                        var listeners_1 = [];
                        topic.listeners.map(function (value) {
                            if (value)
                                listeners_1.push(value);
                        });
                        topic.listeners = listeners_1;
                    }
                }
            }
        };
        var this_1 = this;
        for (var key in this.events) {
            _loop_2(key);
        }
        this.events = events;
    };
    return EventEmitter;
}());
exports.default = EventEmitter;
