import { TestRun, TestResult } from "../types/Tests.type";

function getFailedTests(data: { test_cases: TestRun[] }): TestResult[] {
  const tests: TestRun[] = data?.test_cases;
  if (!tests?.length) return [];

  const failureThreshold = 0.05;

  const failingTests = tests
    .filter((test) => test.fail_rate > failureThreshold)
    .sort((a, b) => b.fail_rate - a.fail_rate)
    .map((test) => ({
      name: test.name,
      passed: test.statuses.passed || 0,
      failed: test.statuses.failed || 0,
      total_runs: test.total_runs || 0,
    }));
  return failingTests;
}

export { getFailedTests };
