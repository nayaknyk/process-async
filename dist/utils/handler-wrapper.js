"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeAsyncEvent = void 0;
const tslib_1 = require("tslib");
const executeAsyncEvent = (handler_1, args_1, ...args_2) => tslib_1.__awaiter(void 0, [handler_1, args_1, ...args_2], void 0, function* (handler, args, options = {
    forkingAllowed: true,
    maxThreads: 4,
}) {
    if (!options.forkingAllowed) {
        yield handler(args);
    }
    // TODO:
    // in main thread create a new worker
    // return response of task completion to terminate the worker
    // check performance spawning more threads than the max CPU count - is this even possible?
    // temp code
    yield handler(args);
});
exports.executeAsyncEvent = executeAsyncEvent;
