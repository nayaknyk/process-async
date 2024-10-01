"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable  @typescript-eslint/no-explicit-any */
const node_events_1 = tslib_1.__importDefault(require("node:events"));
const logger_1 = tslib_1.__importDefault(require("./utils/logger"));
const handler_wrapper_1 = require("./utils/handler-wrapper");
const logger = new logger_1.default("Memory-async-executor");
class MemoryAsyncExecutor extends node_events_1.default {
    constructor() {
        super();
        this.eventRegistry = {};
    }
    registerEvent(eventName, handler) {
        this.eventRegistry[eventName] = handler;
        logger.info("Registering event :", eventName);
        this.on(eventName, (args) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield (0, handler_wrapper_1.executeAsyncEvent)(handler, args);
        }));
    }
    removeEvent(eventName) {
        if (this.eventRegistry[eventName]) {
            logger.info("Removing event : ", eventName);
            this.removeAllListeners(eventName);
            delete this.eventRegistry[eventName];
        }
    }
    processAsync(eventName, args) {
        if (!this.eventRegistry[eventName]) {
            throw new Error(`Event ${eventName} not found`);
        }
        logger.info("Received async call for eventName: " + eventName);
        this.emit(eventName, args);
    }
}
exports.default = MemoryAsyncExecutor;
