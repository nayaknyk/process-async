/* eslint-disable  @typescript-eslint/no-explicit-any */
import EventEmitter from "node:events";
import Logger from "./utils/logger";
import { EventHandler, IAsyncExecutor } from "./IAsyncExecutor";
import { executeAsyncEvent } from "./utils/handler-wrapper";

const logger = new Logger("Memory-async-executor");

export default class MemoryAsyncExecutor
  extends EventEmitter
  implements IAsyncExecutor
{
  eventRegistry: Record<string, EventHandler> = {};

  constructor() {
    super();
  }

  public registerEvent(eventName: string, handler: EventHandler): void {
    if (!this.eventRegistry[eventName]) {
      this.eventRegistry[eventName] = handler;

      logger.info("Registering event :", eventName);

      this.on(eventName, async (args: any[]) => {
        await executeAsyncEvent(handler, args);
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
