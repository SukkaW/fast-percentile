# fast-percentile

Fastest percentile computation in TypeScript / JavaScript for unsorted dataset, 4~7x faster than the second fastest alternative, at all dataset sizes, powered by [quickselect algorithm](https://en.wikipedia.org/wiki/Quickselect).

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

`fast-percentile` is consistently 4~7x faster than all other percentile libraries for all dataset sizes (from `10` to `100,000`).

> `stats-percentile` was skipped for `100,000` size benchmark due to its own very inefficient implementation it took way too long to run.

```
clk: ~3.31 GHz
cpu: Apple M2 Max
runtime: node 24.14.1 (arm64-darwin)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
• p95 (n=10)
------------------------------------------- -------------------------------
fast-percentile               19.59 ns/iter  19.56 ns  31.04 ns ▆█▂▂▁▁▁▁▁▁▁
just-percentile              169.25 ns/iter 172.68 ns 195.90 ns ▁█▆▄▄▃▂▁▁▁▁
percentile                   171.13 ns/iter 175.30 ns 195.98 ns █▇▄▃▄▂▂▁▁▁▁
stats-percentile              71.53 ns/iter  72.67 ns  92.95 ns ▂█▄▂▂▂▁▁▁▁▁

summary
  fast-percentile
   3.65x faster than stats-percentile
   8.64x faster than just-percentile
   8.74x faster than percentile

• p95 (n=100)
------------------------------------------- -------------------------------
fast-percentile              302.52 ns/iter 306.09 ns 336.66 ns █▄▄▃▂▂▂▁▁▁▁
just-percentile                1.18 µs/iter   1.20 µs   1.24 µs ▃▆██▇▃▆▄▄▃▂
percentile                     1.26 µs/iter   1.28 µs   1.36 µs ▄▅███▆▃▂▂▂▁
stats-percentile               5.66 µs/iter   5.66 µs   6.29 µs ▃▆█▅▁▁▁▁▁▁▂

summary
  fast-percentile
   3.91x faster than just-percentile
   4.17x faster than percentile
   18.7x faster than stats-percentile

• p95 (n=1,000)
------------------------------------------- -------------------------------
fast-percentile                3.03 µs/iter   3.06 µs   3.17 µs ▂▄▇▆▃█▄▂▁▃▂
just-percentile               12.73 µs/iter  12.71 µs  12.99 µs ▅▁█▁▃▁▁▁▁▃▃
percentile                    13.30 µs/iter  13.08 µs  20.88 µs ▁█▁▁▁▁▁▁▁▁▁
stats-percentile             530.53 µs/iter 538.21 µs 602.13 µs ▃██▅▄▂▂▂▁▁▁

summary
  fast-percentile
   4.21x faster than just-percentile
   4.4x faster than percentile
   175.33x faster than stats-percentile

• p95 (n=10,000)
------------------------------------------- -------------------------------
fast-percentile               20.78 µs/iter  20.73 µs  20.81 µs █▁▃▃▃▃▁▆▁▁▆
just-percentile              149.75 µs/iter 149.83 µs 177.38 µs ▁█▄▂▂▁▁▁▁▁▁
percentile                   148.17 µs/iter 146.67 µs 172.08 µs ▁█▂▂▁▁▁▁▁▁▁
stats-percentile              52.40 ms/iter  52.45 ms  52.81 ms ▃▁▁▃▆▁█▁▃▁▃

summary
  fast-percentile
   7.13x faster than percentile
   7.21x faster than just-percentile
   2521.52x faster than stats-percentile

• p95 (n=100,000)
------------------------------------------- -------------------------------
fast-percentile              371.92 µs/iter 369.83 µs   1.59 ms █▂▁▁▁▁▁▁▁▁▁
just-percentile                1.38 ms/iter   1.37 ms   3.10 ms █▂▁▁▁▁▁▁▁▁▁
percentile                     1.51 ms/iter   1.49 ms   3.80 ms █▂▁▁▁▁▁▁▁▁▁

summary
  fast-percentile
   3.72x faster than just-percentile
   4.06x faster than percentile
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
