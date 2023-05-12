import { calculateFlakinessTrend, calculateAggregateTrend } from "helpers/flakiness";

const data = [
  {
    name: 'test1',
    total_runs: 10,
    statuses: {
      failed: 2,
      passed: 6,
      error: 2,
    },
    error_rate: 0,
    fail_rate: 20,
    pass_rate: 60,
    avg_duration: 99,
    median_duration: 99,
    total_duration: 990,
  },
  {
    name: 'test2',
    total_runs: 10,
    statuses: {
      failed: 5,
      passed: 5,
    },
    error_rate: 0,
    fail_rate: 50,
    pass_rate: 50,
    avg_duration: 131,
    median_duration: 131,
    total_duration: 1310,
  },
];

// fix the following tests
describe('calculateFlakinessTrend', () => {
  it('should return an object', () => {
    const trend = calculateFlakinessTrend(data, 20);
    expect(typeof trend).toBe('object');
  });

  it('should return an object with the same number of keys as the input array', () => {
    const trend = calculateFlakinessTrend(data, 20);
    expect(Object.keys(trend).length).toBe(data.length);
  });
});

describe('calculateAggregateTrend', () => {
  const trend = {
    test1: [2, 0, 5, 1, 0, 32, 0, 0, 0, 0],
    test2: [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
  };

  test('should return an object', () => {
    const aggregate = calculateAggregateTrend(trend);
    expect(typeof aggregate).toBe('object');
  }
  );

  test('should return an object with the expected keys', () => {
    const aggregate = calculateAggregateTrend(trend);

    // Check if aggregate is not undefined
    expect(aggregate).toBeDefined();

    // Check if aggregate is an object
    expect(typeof aggregate).toBe('object');

    // Check if aggregate has 4 keys (properties)
    expect(Object.keys(aggregate!).length).toBe(4);
    expect(Object.keys(aggregate!).includes('maxBlocks')).toBe(true);
    expect(Object.keys(aggregate!).includes('testQuantity')).toBe(true);
    expect(Object.keys(aggregate!).includes('totalPercentage')).toBe(true);
    expect(Object.keys(aggregate!).includes('aggregatedTrends')).toBe(true);
  });
});
