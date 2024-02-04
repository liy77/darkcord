const zlib = require("./build/Release/zlib.node");

const inflate = (exports.inflate = (buffer, options = {}) => {
  return zlib.inflate(
    buffer,
    options.flush,
    options.windowBits,
    options.chunkSize,
  );
});

const deflate = (exports.deflate = (buffer, options = {}) => {
  return zlib.deflate(
    buffer,
    options.flush,
    options.strategy,
    options.level,
    options.windowBits,
    options.memoryLevel,
  );
});

exports.inflateRaw = (buffer, options = {}) => {
  // Setting windowBits to -47 to allow inflate raw  (-15 Allow Raw, -32 Value to convert the windowBits)
  options.windowBits = -47;
  return inflate(buffer, options);
};

exports.deflateRaw = (buffer, options = {}) => {
  // Setting windowBits to -31 to allow deflate raw  (-15 Allow Raw, -16 Value to convert the windowBits)
  options.windowBits = -31;
  return deflate(buffer, options);
};

exports.constants = zlib.constants;

exports.ProcessSync = zlib.ProcessSync;

exports.createInflateProcess = (options) =>
  new zlib.ProcessSync("inflate", options);
exports.createDeflateProcess = (options) =>
  new zlib.ProcessSync("deflate", options);
exports.createInflateRawProcess = (options) =>
  new zlib.ProcessSync("inflateRaw", options);
exports.createDeflateRawProcess = (options) =>
  new zlib.ProcessSync("deflateRaw", options);
