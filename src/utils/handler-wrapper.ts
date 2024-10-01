import { EventHandler, IForkOptions } from "../IAsyncExecutor";

export const executeAsyncEvent = async (
  handler: EventHandler,
  args: any[],
  options: IForkOptions = {
    forkingAllowed: true,
    maxThreads: 4,
  },
): Promise<void> => {
  if (!options.forkingAllowed) {
    await handler(args);
  }

  // TODO:
  // in main thread create a new worker
  // how do we keep track of number of threads already spawned - ideally this should be tracked by the calling class itself
  // return response of task completion to terminate the worker
  // check performance spawning more threads than the max CPU count - is this even possible?
  // temp code
  await handler(args);
};
