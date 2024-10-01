import Redis, { RedisOptions } from "ioredis";
import Logger from "./logger";
import EventHandlerExecutor from "../IAsyncExecutor";

const logger = new Logger("RedisPubSubProvider");

export interface IRedisExecutorOptions {
  redis: RedisOptions;
  prefix?: string;
}

export default class RedisPubSub<K> {
  private readonly topic: string;
  private handler: EventHandlerExecutor;
  readonly options: IRedisExecutorOptions;
  private static pubClient: Redis;
  private static subClient: Redis;

  constructor(
    options: IRedisExecutorOptions,
    topic: string,
    handler: EventHandlerExecutor,
  ) {
    this.options = options;
    this.topic = topic;
    this.handler = handler;

    RedisPubSub.pubClient = new Redis(options.redis);
    RedisPubSub.subClient = new Redis(options.redis);

    RedisPubSub.subClient.on(
      "message",
      async (topicKey: string, message: string) => {
        const topic = topicKey.replace(this.options.prefix ?? "", "");

        logger.info(`Received message for topic: ${topic} : ${message}`);

        /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
        const data = JSON.parse(message) as { args: any[] };
        await this.handler.executeHandler(data.args);
      },
    );
  }

  private getTopic() {
    return this.options.prefix ?? "" + this.topic;
  }

  public async subscribe(): Promise<void> {
    await RedisPubSub.subClient.subscribe(this.getTopic(), (err, count) => {
      if (err) {
        logger.error("Failed to subscribe to topic: ", err);
      } else {
        logger.info("Subscribed to topic: ", count);
      }
    });
  }

  public async unsubscribeFromTopic() {
    await RedisPubSub.subClient.unsubscribe(this.getTopic());
  }

  public async publish(message: K) {
    try {
      await RedisPubSub.pubClient.publish(
        this.getTopic(),
        JSON.stringify(message),
      );
    } catch (e) {
      logger.error("Failed to publish message: ", e);
      throw new Error("Failed to publish message: " + (e as Error).message);
    }
  }
}
