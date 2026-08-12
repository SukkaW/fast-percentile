import { p } from './index.ts';
import justPercentile from 'just-percentile';
import percentile from 'percentile';

// not support un-sorted input
// import { percentile as percentileJs } from 'percentile-js';
// not support un-sorted input
// import percentileRank from 'percentile-rank';

// @ts-expect-error -- missing types
import statsPercentile from 'stats-percentile';

function generateData(n: number): number[] {
  const data: number[] = [];
  for (let i = 0; i < n; i++) {
    const v = Number((BigInt(i) * 6_364_136_223_846_793_005n + 1_442_695_040_888_963_407n) & 0xFF_FF_FF_FF_FF_FF_FF_FFn);
    data.push(v % 1_000_000);
  }
  return data;
}

const sizes = [10, 100, 1000, 10000, 100000] as const;
const datasets = sizes.reduce<Record<number, number[]>>((result, n) => {
  result[n] = generateData(n);
  return result;
}, {});

const p95 = p(95);

(async () => {
  const { bench, group, run, do_not_optimize, compact, summary } = await import('mitata');

  compact(() => {
    for (let i = 0, len = sizes.length; i < len; i++) {
      const n = sizes[i];
      summary(() => {
        group(`p95 (n=${n.toLocaleString()})`, () => {
          const data = datasets[n];

          bench('fast-percentile', () => do_not_optimize(p95(data)));
          bench('just-percentile', () => do_not_optimize(justPercentile(data, 0.95)));
          bench('percentile', () => do_not_optimize(percentile(95, data)));

          if (n < 100000) {
            bench('stats-percentile', () => do_not_optimize(statsPercentile(data, 95)));
          }
        });
      });
    }
  });

  run();
})();
