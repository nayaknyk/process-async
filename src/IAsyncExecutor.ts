/* eslint-disable  @typescript-eslint/no-explicit-any */

export type EventHandler = (args: any[]) => Promise<void>;

export interface IForkOptions {
  forkingAllowed: boolean;
  maxThreads: number;
}

export interface IAsyncExecutor {
  eventRegistry: Record<string, EventHandler>;
  registerEvent: (eventName: string, handler: EventHandler) => void;
  removeEvent: (eventName: string) => void;
  processAsync: (eventName: string, args: any[]) => void;
}
