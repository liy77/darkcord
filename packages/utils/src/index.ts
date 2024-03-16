// @ts-ignore
import { Base, KeysToCamelCase, MessageAttachment } from "darkcord";
import { APIInteractionResponse } from "discord-api-types/v10";
import { Buffer, Blob } from "node:buffer";
import { readFileSync } from "node:fs";
import { MakeErrorOptions, MessagePostData } from "./types";
import { fetch, FormData } from "undici";
import clone from "lodash.clonedeep";

export * from "./errors";
export * from "./types";

export function parseResponse(res: Response) {
  let result: unknown;

  if (res.status === 204) {
    result = Promise.resolve(null);
  } else if (res.headers.get("content-type")?.startsWith("application/json")) {
    result = res.json();
  } else {
    result = res.arrayBuffer().then((arr) => new Uint8Array(arr));
  }

  return result;
}

export function extractMessageData(
  data:
    | MessagePostData
    | (Omit<APIInteractionResponse, "data"> & { data: MessagePostData }),
  isInteraction = false,
) {
  let d: FormData | string;
  let contentType: string | undefined;

  let postData = data as MessagePostData;
  if (isInteraction && "data" in data) {
    postData = data.data;
  }

  const files = postData.files;

  if (files?.length) {
    contentType = undefined;
    const form = new FormData();

    let index = 0;
    for (const file of files) {
      form.append(
        `files[${index}]`,
        file.file instanceof Blob ? file.file : new Blob([file.file]),
        file.name,
      );
      index++;
    }

    delete postData.files;

    postData.attachments = files.map((file, i) => ({
      id: i.toString(),
      filename: file.name,
      description: file.description,
    }));

    if ("data" in data && isInteraction) {
      data.data = postData;
    }

    form.append(
      "payload_json",
      JSON.stringify(isInteraction ? data : postData),
    );
    d = form;
  } else {
    contentType = "application/json";
    d = JSON.stringify(isInteraction ? data : postData);
  }

  return {
    d,
    contentType,
  };
}

export function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time).unref());
}

export function MakeError(
  options: MakeErrorOptions,
  type:
    | ErrorConstructor
    | TypeErrorConstructor
    | RangeErrorConstructor
    | SyntaxErrorConstructor = Error,
): Error | TypeError | RangeError | SyntaxError {
  return new (class extends (type as ErrorConstructor) {
    [x: string]: any;
    constructor() {
      super(options.message);
      this.name = options.name ?? "DarkcordError";

      if (options.args && Array.isArray(options.args)) {
        for (const [key, value] of options.args) {
          this[key] = value;
        }
      }
    }
  })();
}

export async function buildAttachment(
  attachment: MessageAttachment & { file: URL | string },
): Promise<MessageAttachment> {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof attachment !== "object" || !attachment.file || !attachment.name) {
    throw MakeError({
      name: "InvalidAttachmentError",
      message: "Received invalid attachment",
      args: [
        ["received", attachment],
        [
          "expected",
          {
            name: String,
            description: String,
            file: [Buffer, Blob, String, URL],
          },
        ],
      ],
    });
  }

  if (attachment.file instanceof URL || typeof attachment.file === "string") {
    try {
      new URL(attachment.file);
    } catch {
      return attachment;
    }

    const buffer = await fetch(attachment.file.toString()).then((res) =>
      res.arrayBuffer(),
    );

    return {
      name: attachment.name,
      file: Buffer.from(buffer),
      description: attachment.description,
    };
  }

  return attachment;
}

export function createWebAssemblyModule(path: string) {
  const mod = new WebAssembly.Module(readFileSync(path));

  const instance = new WebAssembly.Instance(mod, {
    wasi_snapshot_preview1: {
      fd_write() {},
      proc_exit() {},
    },
    env: {
      __sys_getcwd() {},
      emscripten_notify_memory_growth() {},
    },
  });

  return instance.exports;
}

export function camelCase(str: string) {
  const words = str
    .replaceAll(/['\u2019]/g, "")
    .match(/[^\x00-\x2ff\x3a-\x40\x5b-\x60\x7b-\x7f]+/g);

  return words!
    .map((v, index) => {
      if (index) {
        let s = v.toLowerCase();
        return s.charAt(0).toUpperCase() + s.slice(1);
      }

      if (
        index === 0 &&
        v.charAt(0).toUpperCase() === v.charAt(0) &&
        v.charAt(1).toLowerCase() === v.charAt(1)
      ) {
        return v.charAt(0).toLowerCase() + v.slice(1);
      }

      return v.toLowerCase();
    })
    .join("");
}

export function bitsArrayToBits(arr: number[], init = 0) {
  return arr.reduce((a, b) => a | b, init);
}

export function objectSnakeKeysToCamelKeys<T extends Record<string, any>>(
  o: T,
): KeysToCamelCase<T> {
  const camelized = {};
  Object.entries(o).forEach(([key, value]) => {
    camelized[camelCase(key)] = value;
  });

  return camelized as KeysToCamelCase<T>;
}

export function isEqual<_1 extends any, _2 extends any>(
  o1: _1,
  o2: _2,
): boolean {
  const equalObject =
    (t: any) =>
    ([key, value]: [string, any]) =>
      isEqual(value, t[key]);
  const equalArray = (t: any) => (value: any, index: number) =>
    isEqual(value, t[index]);

  if ((o1 as any) === (o2 as any)) {
    return true;
  }

  if (Array.isArray(o1) && Array.isArray(o2)) {
    return o1.every(equalArray(o2)) && o2.every(equalArray(o1));
  }

  if (o1 instanceof Map && o2 instanceof Map) {
    return [...o1.entries()].every(equalObject(o2));
  }

  if (typeof o1 !== typeof o2) {
    return false;
  }

  if (typeof o1 === "symbol" && typeof o2 === "symbol") {
    return o1.description === o2.description;
  }

  if (o1 instanceof RegExp && o2 instanceof RegExp) {
    return o1.source === o2.source;
  }

  if (typeof o1 === "number" && typeof o1 === "number") {
    return +o1 == +o2 || (+o1 != +o1 && +o2 != +o2);
  }

  if (typeof o1 === "function" && typeof o2 === "function") {
    return o1.toString() === o2.toString();
  }

  if (typeof o1 === "object" && typeof o2 === "object") {
    return (
      Object.entries(o1 as Record<string, unknown>).every(equalObject(o2)) &&
      Object.entries(o2 as Record<string, unknown>).every(equalObject(o1))
    );
  }

  return false;
}

export function structuredClone<T>(o: T): T {
  if (o instanceof Base) {
    const copy = new { [o.constructor.name]: class {} }[
      o.constructor.name
    ]();

    for (const key in o) {
      if (
        o.hasOwnProperty(key) &&
        !key.startsWith("_") &&
        o[key] !== undefined
      ) {
        copy[key] = o[key];
      }
    }

    return copy as T;
  } else if (o) {
    return clone(o);
  } else {
    return o;
  }
}

export function transformMessagePostData(
  data: string | MessagePostData,
): MessagePostData {
  if (typeof data === "string") {
    return {
      content: data,
    };
  }

  if (
    !data.files &&
    !data.embeds &&
    !data.content &&
    !data.components?.length
  ) {
    throw MakeError({
      name: "InvalidMessagePostData",
      message:
        "Message post data must contain one of the following values: content, embeds, or files",
    });
  }

  return data;
}
