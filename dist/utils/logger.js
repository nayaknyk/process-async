"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable  @typescript-eslint/no-explicit-any */
const debug_1 = tslib_1.__importDefault(require("debug"));
const globalLogger = (0, debug_1.default)("lib");
const errorLogger = (0, debug_1.default)("lib");
class Logger {
    constructor(name) {
        globalLogger.extend(name);
        errorLogger.extend(name);
        globalLogger.log = console.log.bind(console);
        errorLogger.log = console.error.bind(console);
    }
    info(...args) {
        globalLogger.log(...args);
    }
    error(...args) {
        errorLogger.log(...args);
    }
}
exports.default = Logger;
