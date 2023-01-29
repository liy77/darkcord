import { AsyncBucket as Bucket } from "./AsyncBucket";
import type { Rest } from "./Rest";

export class SequentialBucket {
  globalLimit: number;
  globalRemaining: number;
  globalReset: number | null;
  globalDelay: number | null | Promise<void>;
  retryLimit: number;
  restTimeOffset: number;
  timers: Set<NodeJS.Timeout>;
  buckets: Map<string, Bucket>;

  constructor(public rest: Rest) {
    this.globalLimit = Infinity;

    this.globalRemaining = this.globalLimit;

    this.globalReset = null;

    this.globalDelay = null;

    this.retryLimit = 1;

    this.restTimeOffset = 0;

    this.timers = new Set();

    this.buckets = new Map();
  }

  async execute(bucket: Bucket, promiseFn: () => Promise<unknown>) {
    await bucket.queue.wait();

    let data;
    try {
      data = await promiseFn();
      this.rest.emit("request", data);
    } finally {
      bucket.queue.shift();
    }

    return data;
  }

  get limited() {
    return this.globalRemaining <= 0 && Date.now() < Number(this.globalReset);
  }

  setTimeout(fn: () => unknown, ms: number) {
    const timer = setTimeout(async () => {
      this.timers.delete(timer);
      await fn();
    }, ms).unref();

    this.timers.add(timer);
    return timer;
  }

  add(router: string, bucket: Bucket) {
    this.buckets.set(router, bucket);
    return bucket;
  }

  get(router: string) {
    return this.buckets.get(router);
  }

  remove(router: string) {
    return this.buckets.delete(router);
  }
}
