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
      } catch (e) {
        if (e.code === "MODULE_NOT_FOUND") {
          throw new Error("Encoding is ETF, but no erlpack found.");
        }
      }
    }

    return JSON.parse(data);
  }
}
