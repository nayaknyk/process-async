/* eslint-disable  @typescript-eslint/no-explicit-any */

import AsyncLock from "async-lock";
import Logger from "./utils/logger";

export type EventHandler = (args: any[]) => Promise<void>;

export interface IEventHandlerOptions {
  createForks: boolean;
  maxThreads: number;
  sequentialExec?: boolean;
}

export interface IAsyncExecutor {
  eventRegistry: Record<string, EventHandlerExecutor>;
  readonly handlerOptions: IEventHandlerOptions;
  registerEvent: (eventName: string, handler: EventHandler) => void;
  removeEvent: (eventName: string) => void;
  processAsync: (eventName: string, args: any[]) => void;
}

export default class EventHandlerExecutor {
  private readonly handlerName: string;
  private options: IEventHandlerOptions;
  private readonly lock?: AsyncLock;
  private readonly logger: Logger;
  private readonly handler: EventHandler;

  // private threadsUsed?: number;

  constructor(
    options: IEventHandlerOptions = {
      createForks: false,
      maxThreads: 4,
      sequentialExec: false,
    },
    handlerName: string,
    handler: EventHandler,
  ) {
    this.handlerName = handlerName;
    this.options = options;
    this.logger = new Logger("AsyncHandler:" + handlerName);
    this.handler = handler;

    if (this.options.sequentialExec) {
      this.lock = new AsyncLock();
    }
  }

  public async executeHandler(args: any[]): Promise<void> {
    if (!this.options.createForks) {
      if (this.options.sequentialExec) {
        try {
          this.lock?.acquire(this.handlerName, async () => {
            await this.handler(args);
          });
        } catch (e) {
          this.logger.error(
            "Failed to queue handler " + this.handlerName + " :",
            e,
          );

          throw e;
        }
      } else {
        await this.handler(args);
      }
    }
  }
}
