"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisAsyncExecutor = void 0;
const tslib_1 = require("tslib");
/* eslint-disable  @typescript-eslint/no-explicit-any */
const redis_pub_sub_1 = tslib_1.__importDefault(require("./utils/redis-pub-sub"));
const logger_1 = tslib_1.__importDefault(require("./utils/logger"));
const logger = new logger_1.default("RedisAsyncExecutor");
class RedisAsyncExecutor {
    constructor(options) {
        this.eventRegistry = {};
        this.rClient = new redis_pub_sub_1.default(options);
    }
    processAsync(eventName, args) {
        if (!this.eventRegistry[eventName]) {
            throw new Error(`Event ${eventName} not found`);
        }
        logger.info("Received async call for eventName: " + eventName);
        this.rClient
            .publish({ args })
            .then(() => logger.info("Published event: ", eventName));
    }
    registerEvent(eventName, handler) {
        this.eventRegistry[eventName] = handler;
        // todo: add wrapper for handler execution
        logger.info("Registering event :", eventName);
        this.rClient
            .subscribeToTopic(eventName, handler)
            .then(() => logger.info("Event registered successfully"));
    }
    removeEvent(eventName) {
        if (this.eventRegistry[eventName]) {
            logger.info("Removing event :", eventName);
            this.rClient
                .unsubscribeFromTopic()
                .then(() => logger.info("Event removed successfully"));
            delete this.eventRegistry[eventName];
        }
    }
}
exports.RedisAsyncExecutor = RedisAsyncExecutor;
