import { RequestHandlerOptions, RequestHeaders } from "@typings/index";
import { DiscordAPIError, RequestError } from "@utils/Errors";
import { delay, parseResponse } from "@utils/index";
import { RouteBases } from "discord-api-types/v10";
import { BodyInit, fetch, FormData } from "undici";

import { AsyncBucket as Bucket } from "./AsyncBucket";
import { Rest } from "./Rest";
import { SequentialBucket } from "./SequentialBucket";

function getAPIOffset(serverDate: Date) {
  return serverDate.getTime() - Date.now();
}

function calculateReset(reset: string, serverDate: Date) {
  return new Date(Number(reset) * 1000).getTime() - getAPIOffset(serverDate);
}

export interface RequestOptions {
  method?: string;
  reason?: string;
  contentType?: string;
  headers?: {
    [x: string]: string;
  };
  body?: BodyInit;
}

export class RequestHandler {
  auth: string | undefined;
  #apiRoute: string;
  #maxRetry: number;
  #buckets: SequentialBucket;

  constructor(public rest: Rest, options: RequestHandlerOptions = {}) {
    this.auth = options.token;
    this.#apiRoute = RouteBases.api;
    this.#maxRetry = options.maxRetry || 5;
    this.#buckets = new SequentialBucket(rest);
  }

  setToken(token: string) {
    this.auth = token;
    return this;
  }

  get(router: string) {
    return this.#request(router);
  }

  patch(router: string, body?: BodyInit, opts?: Omit<RequestOptions, "body">) {
    return this.#request(router, "PATCH", { body, ...opts });
  }

  put(router: string, body?: BodyInit, opts?: Omit<RequestOptions, "body">) {
    return this.#request(router, "PUT", { body, ...opts });
  }

  post(router: string, body?: BodyInit, opts?: Omit<RequestOptions, "body">) {
    return this.#request(router, "POST", { body, ...opts });
  }

  delete(router: string, opts?: Omit<RequestOptions, "body">) {
    return this.#request(router, "DELETE", opts);
  }

  #globalDelayFor(ms: number) {
    return new Promise<void>((resolve) => {
      this.#buckets.setTimeout(() => {
        this.#buckets.globalDelay = null;
        resolve();
      }, ms);
    });
  }

  async #request(
    router: string,
    method = "GET",
    options: RequestOptions = {}
  ): Promise<unknown | null> {
    const { body, contentType, headers: customHeaders, reason } = options;

    let retries = 1;
    const { auth, rest } = this;
    const maxRetry = this.#maxRetry;
    const buckets = this.#buckets;
    const bucket = buckets.get(router) ?? buckets.add(router, new Bucket());
    const globalDelayFor = this.#globalDelayFor.bind(this);
    router = this.#apiRoute + router;

    const headers = {
      Authorization: auth?.startsWith("Bot") ? auth : "Bot " + auth,
      "User-Agent": `DiscordBot (https://github.com/denkylabs/darkcord, v${
        require("../../package.json").version
      })`,
      ...customHeaders,
    } as RequestHeaders;

    if (contentType !== undefined) {
      headers["Content-Type"] = contentType as string;
    } else if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      contentType === undefined &&
      body instanceof FormData === false
    ) {
      headers["Content-Type"] = "application/json";
    }

    if (reason !== undefined) {
      headers["X-Audit-Log-Reason"] = encodeURIComponent(reason);
    }

    function emitRateLimit(global: boolean, timeout: number, limit: number) {
      rest.emit("rateLimit", {
        global,
        timeout,
        limit,
        router,
        method,
      });
    }

    async function request(): Promise<unknown> {
      const controller = new AbortController();
      const timer = setTimeout(() => {
        controller.abort();
      }, rest.requestTimeout).unref();

      while (buckets.limited || bucket.limited) {
        const isGlobal = buckets.limited;
        let limit: number;
        let timeout: number;
        let delayPromise: number | Promise<unknown>;

        if (isGlobal) {
          limit = buckets.globalLimit;
          timeout =
            Number(buckets.globalReset) + buckets.restTimeOffset - Date.now();

          if (typeof buckets.globalDelay !== "number") {
            buckets.globalDelay = globalDelayFor(timeout);
          }

          delayPromise = buckets.globalDelay as Promise<unknown>;
        } else {
          limit = bucket.limit;
          timeout = bucket.reset + buckets.restTimeOffset - Date.now();
          delayPromise = delay(timeout);
        }

        emitRateLimit(isGlobal, timeout, limit);
        await delayPromise;
      }

      const res = await fetch(router, {
        body:
          typeof body === "object" && !(body instanceof FormData)
            ? JSON.stringify(body)
            : body,
        method,
        headers: headers as unknown as HeadersInit,
        signal: controller.signal,
      }).finally(() => clearTimeout(timer));

      const _serverDate = res.headers.get("date") as string;
      const _limit = res.headers.get("x-ratelimit-limit");
      const _remaining = res.headers.get("x-ratelimit-remaining");
      const _reset = res.headers.get("x-ratelimit-reset");

      const serverDate = new Date(_serverDate);
      const limit = _limit ? Number(_limit) : Infinity;
      const remaining = _remaining ? Number(_remaining) : 1;
      let sublimitTimeout: number | undefined;
      let reset = _reset ? calculateReset(_reset, serverDate) : Date.now();
      let retryAfter: number | null | string = res.headers.get("retry-after");
      retryAfter = retryAfter ? Number(retryAfter) * 1000 : -1;

      if (router.includes("reactions") === true) {
        reset = serverDate.getTime() - getAPIOffset(serverDate) + 250;
      }

      bucket.limit = limit;
      bucket.remaining = remaining;
      bucket.reset = reset;

      if (retryAfter > 0) {
        if (res.headers.get("x-ratelimit-global") !== null) {
          buckets.globalRemaining = 0;
          buckets.globalReset = Date.now() + retryAfter;
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        } else if (bucket.limited === false) {
          sublimitTimeout = retryAfter;
        }
      }

      if (res.ok === true) {
        if (method === "DELETE") {
          // Remove bucket from cache
          buckets.remove(router);
        }

        return parseResponse(res as any);
      }

      if (res.status >= 400 && res.status < 500) {
        if (res.status === 429) {
          rest.emit(
            "warn",
            `Rate-Limit on route ${router}${
              sublimitTimeout !== undefined ? " for sublimit" : ""
            }`
          );

          if (sublimitTimeout !== undefined) {
            await delay(sublimitTimeout);
            return request();
          }
        }
        let data: any;
        try {
          data = await parseResponse(res as any);
        } catch (err) {
          const _ = err as RequestError;
          throw new RequestError(
            router,
            method,
            _.message,
            _.constructor.name,
            _.code
          );
        }

        throw new DiscordAPIError(
          router,
          method,
          data?.code,
          res.status,
          data?.errors ?? data
        );
      }

      if (res.status >= 500 && res.status < 600) {
        if (retries === maxRetry) {
          throw new RequestError(
            router,
            method,
            res.statusText,
            "APIRequest",
            res.status
          );
        }

        retries++;
        return request();
      }

      return null;
    }

    return buckets.execute(bucket, request);
  }
}
