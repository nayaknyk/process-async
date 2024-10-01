"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ioredis_1 = tslib_1.__importDefault(require("ioredis"));
const logger_1 = tslib_1.__importDefault(require("./logger"));
const handler_wrapper_1 = require("./handler-wrapper");
const logger = new logger_1.default("RedisPubSubProvider");
class RedisPubSub {
    constructor(options) {
        this.options = options;
        RedisPubSub.pubClient = new ioredis_1.default(options.redis);
        RedisPubSub.subClient = new ioredis_1.default(options.redis);
        RedisPubSub.subClient.on("message", (topicKey, message) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a;
            const topic = topicKey.replace((_a = this.options.prefix) !== null && _a !== void 0 ? _a : "", "");
            logger.info(`Received message for topic: ${topic} : ${message}`);
            if (this.handler != null) {
                /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
                const data = JSON.parse(message);
                yield (0, handler_wrapper_1.executeAsyncEvent)(this.handler, data.args);
            }
        }));
    }
    getTopic() {
        var _a;
        return (_a = this.options.prefix) !== null && _a !== void 0 ? _a : "" + this.topic;
    }
    subscribeToTopic(topic, handler) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!topic) {
                throw new Error("Topic cannot be undefined");
            }
            if (!handler) {
                throw new Error("Handler cannot be undefined");
            }
            this.topic = topic;
            this.handler = handler;
            yield RedisPubSub.subClient.subscribe(this.getTopic(), (err, count) => {
                if (err) {
                    logger.error("Failed to subscribe to topic: ", err);
                }
                else {
                    logger.info("Subscribed to topic: ", count);
                }
            });
        });
    }
    unsubscribeFromTopic() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield RedisPubSub.subClient.unsubscribe(this.getTopic());
        });
    }
    publish(message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield RedisPubSub.pubClient.publish(this.getTopic(), JSON.stringify(message));
            }
            catch (e) {
                logger.error("Failed to publish message: ", e);
                throw new Error("Failed to publish message: " + e.message);
            }
        });
    }
}
exports.default = RedisPubSub;
