/* eslint-disable  @typescript-eslint/no-explicit-any */
import debug from "debug";

const globalLogger = debug("lib");
const errorLogger = debug("lib");

export default class Logger {
  constructor(name: string) {
    globalLogger.extend(name);
    errorLogger.extend(name);
    globalLogger.log = console.log.bind(console);
    errorLogger.log = console.error.bind(console);
  }

  public info(...args: any[]) {
    globalLogger.log(...args);
  }

  public error(...args: any[]) {
    errorLogger.log(...args);
  }
}
