import { createWebAssemblyModule, MakeError } from "./index";
import path from "node:path";

export class Zlib {
  _wasm: any;
  constructor() {
    this._wasm = createWebAssemblyModule(path.join(__dirname, "zlib.wasm"));
  }

  length() {
    return this._wasm.wlen();
  }

  alloc(size: number): number {
    return this._wasm.walloc(size);
  }

  free(bytes: number, size: number) {
    return this._wasm.wfree(bytes, size);
  }

  u8(bytes: number, size: number) {
    return new Uint8Array(this.#wasmMemoryBuffer, bytes, size);
  }

  #copyAndFree(bytes: number, size: number) {
    const copy = this.u8(bytes, size);
    return this.free(bytes, size), copy;
  }

  compress(buffer: Buffer, level: number = 3) {
    const bytes = this.alloc(buffer.length);
    this.u8(bytes, buffer.length).set(buffer);

    return this.#copyAndFree(
      this._wasm.compress(bytes, buffer.length, level),
      this.length(),
    );
  }

  decompress(buffer: Buffer | Uint8Array, limit = 0) {
    const bytes = this.alloc(buffer.length);
    this.u8(bytes, buffer.length).set(buffer);

    const data = this._wasm.decompress(bytes, buffer.length, limit);

    if (data === 0) {
      throw MakeError({
        name: "Zlib",
        message: "Failed to decompress",
      });
    }

    return this.#copyAndFree(data, this.length());
  }

  get #wasmMemoryBuffer() {
    return this._wasm.memory.buffer;
  }
}
