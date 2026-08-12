import { describe, it } from 'mocha';
import { expect } from 'earl';
import { p } from './index';
import { createFixedArray } from 'foxts/create-fixed-array';

function exactPercentile(data: number[], p: number): number {
  const sorted = data.slice().sort((a, b) => a - b);
  const r = Math.ceil((p * sorted.length) / 100);
  return sorted[r - 1];
}

function lcg(i: number, mul: bigint, add: bigint, mod = 10000n): number {
  const v = (BigInt(i) * mul + add) & 0xFF_FF_FF_FF_FF_FF_FF_FFn;
  return Number(v % mod) / Number(mod);
}

const p50 = p(50);

describe('p', () => {
  it('throws on empty samples', () => {
    expect(() => p50([])).toThrow(expect.a(RangeError));
  });

  it('throws on out-of-range percentile', () => {
    expect(() => p(-1)).toThrow(expect.a(RangeError));
    expect(() => p(101)).toThrow(expect.a(RangeError));
    expect(() => p(50.5)).toThrow(expect.a(RangeError));
  });

  it('computes p0 as minimum', () => {
    expect(p(0)([5, 3, 8, 1, 9])).toEqual(1);
  });

  it('computes p100 as maximum', () => {
    expect(p(100)([5, 3, 8, 1, 9])).toEqual(9);
  });

  it('computes median of odd-length array', () => {
    expect(p50([1, 2, 3, 4, 5])).toEqual(3);
  });

  it('computes p95 using nearest-rank', () => {
    const data = createFixedArray(100).map(i => i + 1);
    expect(p(95)(data)).toEqual(95);
  });

  it('does not mutate the input array', () => {
    const data = [5, 3, 1, 4, 2];
    const copy = data.slice();
    p50(data);
    expect(data).toEqual(copy);
  });

  it('handles single-element array', () => {
    expect(p50([42])).toEqual(42);
    expect(p(0)([42])).toEqual(42);
    expect(p(100)([42])).toEqual(42);
  });

  it('handles duplicates', () => {
    expect(p50([3, 3, 3, 3, 3])).toEqual(3);
    expect(p(25)([1, 1, 2, 2])).toEqual(1);
  });

  it('matches sort-based result on large array', () => {
    const data: number[] = [];
    for (let i = 0; i < 100000; i++) {
      data.push(lcg(i, 6_364_136_223_846_793_005n, 1_442_695_040_888_963_407n));
    }
    const percentiles = [1, 10, 25, 50, 75, 90, 95, 99];
    for (let i = 0, len = percentiles.length; i < len; i++) {
      const pct = percentiles[i];
      expect(p(pct)(data)).toEqual(exactPercentile(data, pct));
    }
  });

  it('handles already-sorted input', () => {
    const data = createFixedArray(1000).map(i => i + 1);
    expect(p(50)(data)).toEqual(exactPercentile(data, 50));
    expect(p(99)(data)).toEqual(exactPercentile(data, 99));
  });

  it('handles reverse-sorted input', () => {
    const data = createFixedArray(1000).map(i => 1000 - i);
    expect(p(50)(data)).toEqual(exactPercentile(data, 50));
    expect(p(1)(data)).toEqual(exactPercentile(data, 1));
  });
});
