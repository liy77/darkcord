import { PromiseQueue } from "@typings/index";

export class AsyncQueue {
  promises: PromiseQueue[] = [];
  get remaining() {
    return this.promises.length;
  }

  wait() {
    const next =
      this.promises.length !== 0
        ? this.promises[this.promises.length - 1].promise
        : Promise.resolve();

    let resolveFn: CallableFunction | undefined;
    const promise = new Promise((resolve) => {
      resolveFn = resolve;
    });

    this.promises.push({
      resolve: resolveFn as CallableFunction,
      promise,
    });

    return next;
  }

  shift() {
    const deferred = this.promises.shift();
    deferred?.resolve();
  }
}
