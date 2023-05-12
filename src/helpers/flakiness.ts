import { TestCase } from "../types/Tests.type";
import { ObjArray } from "../types/global.types";

export const calculateFlakinessTrend = (
  data: TestCase[],
  xRuns: number
): ObjArray => {
  // Initialize an object to store the flakiness trend for each test case.
  const flakinessTrend: { [key: string]: number[] } = {};

  // Iterate through each test case in the data.
  for (const testCase of data) {
    const testRuns = testCase.total_runs;
    const flakinessData: number[] = [];

    // Iterate through the test runs, with a step size of xRuns.
    for (let i = 0; i < testRuns; i += xRuns) {
      // Define the start and end indices for the current group of X runs.
      const startIndex = i;
      const endIndex = Math.min(i + xRuns, testRuns);

      // Calculate the number of relevant runs in the current group.
      const relevantRuns = endIndex - startIndex;
      // Calculate the number of failed runs in the current group, considering the remaining runs.
      const failedRuns = testCase.statuses.failed
        ? Math.min(testCase.statuses.failed, relevantRuns)
        : 0;

      // Calculate the flakiness percentage for the current group of X runs.
      const flakinessPercentage = ((failedRuns / relevantRuns) * 100);

      // Add the flakiness percentage to the flakinessData array.
      flakinessData.push(flakinessPercentage);
    }



    // Store the flakiness data for the current test case in the flakinessTrend object.
    flakinessTrend[testCase.name] = flakinessData;
  }

  // Return the flakiness trend object.
  return flakinessTrend;
}

export const calculateAggregateTrend = (trend?: ObjArray) => {
  if (!trend) return;
  const testQuantity = Object.entries(trend).reduce((accumulator, current) => {
    return accumulator + current[1].length;
  }, 0);

  const maxBlocks = Object.entries(trend).reduce((acc, test) => {
    const blocks = test[1].length;
    return blocks > acc ? acc = blocks : acc;
  }, 0);

  const percentageSum = Object.entries(trend).reduce((accumulator, current) => {
    return accumulator + current[1].reduce((curr, acc) => acc + curr, 0);
  }, 0);

  const totalPercentage = percentageSum / testQuantity;

  const aggregate: ObjArray = { 'total': [] };

  for (let i = 0; i < maxBlocks; i++) {
    let percentageSum = 0;
    let quantity = 0;
    Object.entries(trend).forEach((test) => {
      if (test[1][i]) {
        percentageSum += test[1][i];
        quantity++;
      }
    });
    aggregate['total'].push(percentageSum / quantity);
  }

  return ({ maxBlocks, testQuantity, totalPercentage, aggregatedTrends: aggregate });
}


