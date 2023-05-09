export interface TestCases {
  test_cases: TestCase[];
  total: number;
  statuses: TestStatuses;
  avg_runtime: string;
}

export interface TestCase {
  name: string;
  statuses: TestStatuses;
  total_runs: number;
  error_rate: number;
  fail_rate: number;
  pass_rate: number;
  avg_duration: number;
  median_duration: number;
  total_duration: number;
}

export interface TestStatuses {
  passed?: number;
  failed?: number;
  error?: number;
  complete?: number;
}

export interface Error {
  detail: string;
}
