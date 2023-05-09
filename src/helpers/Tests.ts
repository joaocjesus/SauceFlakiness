import { TestCases } from "../types/Tests.type";

class Tests {
  private source: TestCases;
  private failureThreshold = 0.05;

  constructor(data: TestCases) {
    this.source = { ...data };
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
  }

  public statuses() {
    return this.data().statuses;
  }
}

export default Tests;
