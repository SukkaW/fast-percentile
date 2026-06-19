function quickSelect(arr: number[], rank: number): number {
  let low = 0;
  let high = arr.length;

  while (true) {
    const pivot = arr[low];

    if (low >= high - 1) {
      return pivot;
    }

    let bottom = low;
    let top = high - 1;

    while (bottom < top) {
      while (bottom < top && arr[bottom] < pivot) bottom++;
      while (bottom < top && arr[top] >= pivot) top--;
      if (bottom < top) {
        const tmp = arr[bottom];
        arr[bottom] = arr[top];
        arr[top] = tmp;
      }
    }

    if (rank <= bottom) {
      high = bottom;
    } else {
      low = bottom;

      bottom = low;
      top = high - 1;

      while (bottom < top) {
        while (bottom < top && arr[bottom] === pivot) bottom++;
        while (bottom < top && arr[top] !== pivot) top--;
        if (bottom < top) {
          const tmp = arr[bottom];
          arr[bottom] = arr[top];
          arr[top] = tmp;
        }
      }

      if (rank <= bottom) {
        return pivot;
      }

      low = bottom;
    }
  }
}

export function p(p: number) {
  if (p < 0 || p > 100 || (p | 0) !== p) {
    throw new RangeError('percentile must be an integer in [0, 100]');
  }

  if (p === 0) {
    return function p0(samples: number[]): number {
      const length = samples.length;
      if (length === 0) {
        throw new RangeError('samples must not be empty');
      }

      let min = samples[0];
      for (let i = 1; i < length; i++) {
        if (samples[i] < min) min = samples[i];
      }
      return min;
    };
  }

  if (p === 100) {
    return function p100(samples: number[]): number {
      const length = samples.length;
      if (length === 0) {
        throw new RangeError('samples must not be empty');
      }

      let max = samples[0];
      for (let i = 1; i < length; i++) {
        if (samples[i] > max) max = samples[i];
      }
      return max;
    };
  }

  return function (samples: number[]): number {
    const length = samples.length;
    if (length === 0) {
      throw new RangeError('samples must not be empty');
    }

    const r = Math.ceil((p * length) / 100);
    return quickSelect(samples.slice(), r);
  };
}

export const p50 = p(50);
export const p95 = p(95);
export const p99 = p(99);
