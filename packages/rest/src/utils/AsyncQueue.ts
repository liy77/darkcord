export interface PromiseQueue {
  resolve: CallableFunction;
  promise: Promise<unknown>;
}

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
      resolve: resolveFn!,
      promise,
    });

    return next;
  }

  shift() {
    const deferred = this.promises.shift();
    deferred?.resolve();
  }
}
