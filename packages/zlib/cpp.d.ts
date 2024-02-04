export interface DeflateOptions {
  strategy?: number;
  flush?: number;
  level?: number;
  windowBits?: number;
  memoryLevel?: number;
}

export interface InflateOptions {
  windowBits?: number;
  flush?: number;
  chunkSize?: number;
}
export type InflateRawOptions = Omit<InflateOptions, "windowBits">;
export type DeflateRawOptions = Omit<DeflateOptions, "windowBits">;

export const enum constants {
  Z_VERSION_ERROR = -6,
  Z_BUF_ERROR = -5,
  Z_MEM_ERROR = -4,
  Z_DATA_ERROR = -3,
  Z_STREAM_ERROR = -2,
  Z_ERRNO = -1,
  Z_DEFAULT_COMPRESSION = -1,
  Z_NO_FLUSH,
  Z_OK = 0,
  Z_NO_COMPRESSION = 0,
  Z_DEFAULT_STRATEGY = 0,
  Z_BINARY = 0,
  Z_STREAM_END,
  Z_PARTIAL_FLUSH = 1,
  Z_TEXT = 1,
  Z_ASCII = 1,
  Z_BEST_SPEED = 1,
  Z_HUFFMAN_ONLY,
  Z_SYNC_FLUSH = 2,
  Z_NEED_DICT = 2,
  Z_UNKNOWN = 2,
  Z_FULL_FLUSH,
  Z_RLE = 3,
  Z_FINISH,
  Z_BLOCK,
  Z_TREES,
  Z_DEFLATED = 8,
  Z_BEST_COMPRESSION,
}

export function inflate(buffer: Buffer, options?: InflateOptions): Buffer;
export function deflate(
  buffer: Buffer | string,
  options?: DeflateOptions,
): Buffer;
export function inflateRaw(buffer: Buffer, options?: InflateRawOptions): Buffer;
export function deflateRaw(
  buffer: Buffer | string,
  options?: DeflateRawOptions,
): Buffer;

export type ProcessSyncValidMethod =
  | "inflate"
  | "deflate"
  | "inflateRaw"
  | "deflateRaw";

export type ProcessSyncOptions<M extends ProcessSyncValidMethod> =
  M extends "inflateRaw"
    ? InflateRawOptions
    : M extends "deflateRaw"
    ? DeflateRawOptions
    : M extends "inflate"
    ? InflateOptions
    : DeflateOptions;

export class ProcessSync {
  result: Buffer;
  windowBits: number;
  chunkSize: number;
  defaultFlush: constants;
  constructor<M extends ProcessSyncValidMethod>(
    method: M,
    options?: ProcessSyncOptions<M>,
  );
  push(buf: Buffer | string, flush?: constants): Buffer;
}

export function createInflateProcess(options: InflateOptions): ProcessSync;
export function createDeflateProcess(options: DeflateOptions): ProcessSync;
export function createInflateRawProcess(
  options: InflateRawOptions,
): ProcessSync;
export function createDeflateRawProcess(
  options: DeflateRawOptions,
): ProcessSync;
