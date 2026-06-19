# fast-percentile

Fastest percentile computation in TypeScript / JavaScript for unsorted input, 4~7x faster than the second fastest alternative, powered by [quickselect algorithm](https://en.wikipedia.org/wiki/Quickselect).

## Install

```bash
# npm
npm install fast-percentile
# pnpm
pnpm add fast-percentile
# yarn
yarn add fast-percentile
```

## Usage

```ts
import { p, p50, p95, p99 } from 'fast-percentile';

const data = [12, 5, 99, 37, 2, 84, 61, 43, 78, 25];

// Pre-built helpers
p50(data); // median
p95(data); // 95th percentile
p99(data); // 99th percentile

// Create a reusable percentile function for any value in [0, 100]
const p75 = p(75);
p75(data);

// One-off
p(90)(data);
```

`p()` returns a curried function — create it once and reuse it across many arrays to avoid repeated validation.

- `p(0)` returns the minimum (O(n) linear scan)
- `p(100)` returns the maximum (O(n) linear scan)
- The input array is never mutated

## How it works

Most percentile libraries sort the input array (`O(n log n)`). `fast-percentile` uses the [quickselect algorithm](https://en.wikipedia.org/wiki/Quickselect) to find the k-th smallest element in O(n) average time without a full sort, using the [Nearest Rank](https://en.wikipedia.org/wiki/Percentile#The_nearest-rank_method) method.

## Benchmark

```bash
pnpm run bench
```

```
clk: ~3.31 GHz
cpu: Apple M2 Max
runtime: node 24.14.1 (arm64-darwin)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
• p95 (n=100)
------------------------------------------- -------------------------------
fast-percentile              291.75 ns/iter 297.64 ns 329.18 ns ▃▅██▅▄▃▂▂▁▁
just-percentile                1.20 µs/iter   1.22 µs   1.28 µs ▃▃▅▆█▅▅▄▂▁▁
percentile                     1.42 µs/iter   1.37 µs   3.05 µs █▄▁▁▁▁▁▁▁▁▁
stats-percentile               5.76 µs/iter   5.71 µs   6.42 µs ▃█▆▃▁▁▁▁▂▁▃

summary
  fast-percentile
   4.11x faster than just-percentile
   4.88x faster than percentile
   19.75x faster than stats-percentile

• p95 (n=1,000)
------------------------------------------- -------------------------------
fast-percentile                3.06 µs/iter   3.09 µs   3.57 µs ▂█▅▃▂▂▂▁▁▁▂
just-percentile               12.91 µs/iter  12.91 µs  13.07 µs █▅█▅▁▅▅▁▁▁▅
percentile                    13.47 µs/iter  13.25 µs  21.92 µs ▂█▂▁▂▁▁▁▁▁▁
stats-percentile             535.33 µs/iter 545.92 µs 617.08 µs ▅██▇▅▃▂▂▁▁▁

summary
  fast-percentile
   4.22x faster than just-percentile
   4.4x faster than percentile
   174.9x faster than stats-percentile

• p95 (n=10,000)
------------------------------------------- -------------------------------
fast-percentile               20.41 µs/iter  20.49 µs  20.51 µs ▃▆▁▃█▁▁▁▁▆▆
just-percentile              151.24 µs/iter 153.13 µs 178.79 µs ▁█▅▃▂▂▁▁▁▁▁
percentile                   150.35 µs/iter 151.88 µs 177.33 µs ▁█▄▃▂▂▁▁▁▁▁
stats-percentile              52.29 ms/iter  52.33 ms  52.60 ms ▅▁▅█▁▅▁█▁▅▅

summary
  fast-percentile
   7.37x faster than percentile
   7.41x faster than just-percentile
   2562.52x faster than stats-percentile

• p95 (n=100,000)
------------------------------------------- -------------------------------
fast-percentile              346.74 µs/iter 341.92 µs   1.32 ms █▂▁▁▁▁▁▁▁▁▁
just-percentile                1.40 ms/iter   1.39 ms   3.21 ms █▅▁▁▁▁▁▁▁▁▁
percentile                     1.50 ms/iter   1.48 ms   3.63 ms █▂▁▁▁▁▁▁▁▁▁
stats-percentile                5.30 s/iter    5.32 s    5.33 s ▃▁▃▃▁█▃▃▃▁▆

summary
  fast-percentile
   4.05x faster than just-percentile
   4.32x faster than percentile
   15297.07x faster than stats-percentile
```

## License

[MIT](LICENSE)

----

**fast-percentile** © [Sukka](https://github.com/SukkaW), Released under the [MIT](./LICENSE) License.
Authored and maintained by Sukka with help from contributors ([list](https://github.com/SukkaW/zstd-size/graphs/contributors)).

> [Personal Website](https://skk.moe) · [Blog](https://blog.skk.moe) · GitHub [@SukkaW](https://github.com/SukkaW) · Telegram Channel [@SukkaChannel](https://t.me/SukkaChannel) · Mastodon [@sukka@acg.mn](https://acg.mn/@sukka) · Twitter [@isukkaw](https://twitter.com/isukkaw) · BlueSky [@skk.moe](https://bsky.app/profile/skk.moe)

<p align="center">
  <a href="https://github.com/sponsors/SukkaW/">
    <img src="https://sponsor.cdn.skk.moe/sponsors.svg"/>
  </a>
</p>
