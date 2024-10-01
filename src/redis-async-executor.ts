/* eslint-disable  @typescript-eslint/no-explicit-any */
import RedisPubSub, { IRedisExecutorOptions } from "./utils/redis-pub-sub";
import Logger from "./utils/logger";
import { EventHandler, IAsyncExecutor } from "./IAsyncExecutor";

const logger = new Logger("RedisAsyncExecutor");

export class RedisAsyncExecutor implements IAsyncExecutor {
  eventRegistry: Record<string, EventHandler> = {};
  private redisClientRegistry: Record<string, RedisPubSub<any>> = {};
  private readonly options: IRedisExecutorOptions;

  constructor(options: IRedisExecutorOptions) {
    this.options = options;
  }

  processAsync(eventName: string, args: any[]): void {
    if (!this.eventRegistry[eventName]) {
      throw new Error(`Event ${eventName} not found`);
    }

    logger.info("Received async call for eventName: " + eventName);
    this.redisClientRegistry[eventName]
      .publish({ args })
      .then(() => logger.info("Published event: ", eventName));
  }

  registerEvent(eventName: string, handler: EventHandler): void {
    if (!this.eventRegistry[eventName]) {
      this.eventRegistry[eventName] = handler;

      logger.info("Registering event :", eventName);
      const client = new RedisPubSub<any>(this.options);
      client
        .subscribeToTopic(eventName, handler)
        .then(() => logger.info("Event registered successfully"));

      this.redisClientRegistry[eventName] = client;
    }
  }

  removeEvent(eventName: string): void {
    if (this.eventRegistry[eventName]) {
      logger.info("Removing event :", eventName);

      this.redisClientRegistry[eventName]
        .unsubscribeFromTopic()
        .then(() => logger.info("Event removed successfully"));

      delete this.eventRegistry[eventName];
      delete this.redisClientRegistry[eventName];
    }
  }
}
