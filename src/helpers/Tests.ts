import { TestCases, TestResult } from "../types/Tests.type";

class Tests {
  private source: TestCases;
  private testCasesResults: TestResult[];
  private failureThreshold = 0.05;

  constructor(data: TestCases) {
    this.source = { ...data };
    this.testCasesResults = this.getResults();
  }

  private getResults(): TestResult[] {
    return this.source.test_cases.map((test) => ({
      name: test.name,
      passed: test.statuses.passed || 0,
      failed: test.statuses.failed || 0,
      total_runs: test.total_runs || 0,
    }));
  }

  public testCases() {
    return this.source.test_cases;
  }

  public data() {
    return this.source;
  }

  public failedTests() {
    return this.testCases()
      .filter((test) => test.fail_rate > this.failureThreshold)
      .sort((a, b) => b.fail_rate - a.fail_rate);
  }

  public setData(data: TestCases) {
    this.source = data;
    this.testCasesResults = this.getResults();
  }

  public testResults() {
    return this.testCasesResults;
  }

  public statuses() {
    return this.data().statuses;
  }
}

export default Tests;
