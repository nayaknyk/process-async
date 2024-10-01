"use strict";
/* eslint-disable  @typescript-eslint/no-explicit-any */
// Todo: import async executors from individual packages and create named exports
/*
 * Specifications:
 * --------------
 * 1. Input options
 * - with redis or not
 * - connection options for redis
 * - string prefix to be used if redis is being used
 * - worker switchover threshold (by default this can be 0.5)
 * - max workers to be created (by default this should be the number of available logical CPU threads)
 *
 * 2. Usage
 * - create new executor with input options
 * - expose the registerAsync function call
 * - expose the processAsync function call
 *
 * 3. Working
 * - if in non redis mode use event emitter, otherwise use redis pub sub
 * - on sub,
 * - if CPU usage is less than the worker switchover threshold then execute the worker logic in the same thread itself
 * - otherwise, create a new worker thread and execute the logic there
 * - error handling?
 * - on completion?
 *
 * 4. Why should anyone use this over bull?
 * - can it be clubbed with bull ?
 * - performance ?
 * - light weight ?
 * */ 
