export interface TestCases {
  test_cases: TestCase[];
  total: number;
  statuses: Statuses;
  detail?: string;
}

export interface TestCase {
  name: string;
  statuses: Statuses;
  total_runs: number;
  fail_rate: number;
  pass_rate: number;
}
export interface Statuses {
  passed: number;
  failed: number;
  complete?: number;
  error?: number;
}

export interface TestResult {
  name: string;
  passed: number;
  failed: number;
  total_runs: number;
}
