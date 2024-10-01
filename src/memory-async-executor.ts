/* eslint-disable  @typescript-eslint/no-explicit-any */
import EventEmitter from "node:events";
import Logger from "./utils/logger";
import EventHandlerExecutor, { EventHandler, IAsyncExecutor, IEventHandlerOptions, } from "./IAsyncExecutor";

const logger = new Logger("Memory-async-executor");

export default class MemoryAsyncExecutor
  extends EventEmitter
  implements IAsyncExecutor
{
  eventRegistry: Record<string, EventHandlerExecutor> = {};
  readonly handlerOptions: IEventHandlerOptions;

  constructor(options: IEventHandlerOptions) {
    super();
    this.handlerOptions = options;
  }

  public registerEvent(eventName: string, handler: EventHandler): void {
    if (!this.eventRegistry[eventName]) {
      const eventHandler = new EventHandlerExecutor(
        this.handlerOptions,
        eventName,
        handler,
      );
      this.eventRegistry[eventName] = eventHandler;

      logger.info("Registering event :", eventName);

      this.on(eventName, async (args: any[]) => {
        await eventHandler.executeHandler(args);
      });
    }
  }

  public removeEvent(eventName: string): void {
    if (this.eventRegistry[eventName]) {
      logger.info("Removing event : ", eventName);

      this.removeAllListeners(eventName);
      delete this.eventRegistry[eventName];
    }
  }

  public processAsync(eventName: string, args: any[]): void {
    if (!this.eventRegistry[eventName]) {
      throw new Error(`Event ${eventName} not found`);
    }

    logger.info("Received async call for eventName: " + eventName);
    this.emit(eventName, args);
  }
}
