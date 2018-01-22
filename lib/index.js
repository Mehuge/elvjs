"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var emitter_1 = require("./emitter");
exports.EventEmitter = emitter_1.default;
var events = new emitter_1.default();
exports.default = events;
