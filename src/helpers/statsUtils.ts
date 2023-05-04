import { TestResult, TestCase } from "../types/Tests.type";

function getFailedTests(data: TestCase[]): TestResult[] {
  if (!data?.length) return [];

  const failureThreshold = 0.05;

  const failingTests = data
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
