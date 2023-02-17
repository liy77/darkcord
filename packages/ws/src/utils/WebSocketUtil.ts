export namespace WebSocketUtil {
  export function pack(data: any, encoding: "etf" | "json") {
    if (encoding === "etf") {
      try {
        const erlpack = require("erlpack");
        return erlpack.pack(data);
      } catch {}
    }

    return JSON.stringify(data);
  }

  export function unpack(data: any, encoding: "etf" | "json") {
    if (encoding === "etf") {
      try {
        const erlpack = require("erlpack");
        return erlpack.unpack(data);
      } catch {}
    }

    return JSON.parse(data);
  }
}
