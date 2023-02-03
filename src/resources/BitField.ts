export class BitField<
  T extends number | bigint = number,
  FLAGS = Record<string, number | bigint>
> {
  constructor(public raw: T, public flags: FLAGS) {}
  has(bits: T) {
    return (bits & this.raw) === bits;
  }

  toArray() {
    return Object.keys(this.flags as unknown as object).filter((bit) =>
      this.has((this.flags as Record<string, unknown>)[bit] as T)
    );
  }
}
