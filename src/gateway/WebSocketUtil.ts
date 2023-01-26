export class WebSocketUtil {
  static pack(data: any, encoding: "etf" | "json") {
    if (encoding === "etf") {
      try {
        const erlpack = require("erlpack");
        return erlpack.pack(data);
      } catch {}
    }

    return JSON.stringify(data);
  }

  static unpack(data: any, encoding: "etf" | "json") {
    if (encoding === "etf") {
      try {
        const erlpack = require("erlpack");
        return erlpack.unpack(data);
      } catch {}
    }

    return JSON.parse(data);
  }
}
