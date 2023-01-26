import { AsyncQueue } from "./AsyncQueue";

export class AsyncBucket {
  queue: AsyncQueue;
  remaining: number;
  limit: number;
  reset: number;

  constructor() {
    this.remaining = 0;

    this.limit = -1;

    this.reset = -1;

    this.queue = new AsyncQueue();
  }

  get limited() {
    return this.remaining <= 0 && Date.now() < this.reset;
  }

  get inactive() {
    return this.queue.remaining === 0 && !this.limited;
  }
}
