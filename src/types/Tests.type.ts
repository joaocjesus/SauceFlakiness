export interface Test {
  name: string;
  statuses: {
    passed: number;
    failed: number;
  };
  total_runs: number;
  fail_rate: number;
  pass_rate: number;
}

export interface TestResult {
  name: string;
  passed: number;
  failed: number;
  total_runs: number;
}


export interface Statuses {
  passed: 0,
  failed: 0,
}