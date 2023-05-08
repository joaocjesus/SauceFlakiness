import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { TestCase } from "../types/Tests.type";
import "chart.js/auto";

function calculateFlakinessTrend(
  data: TestCase[],
  xRuns: number
): { [key: string]: number[] } {
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
      const failedRuns = Math.min(testCase.statuses.failed, relevantRuns);

      // Calculate the flakiness percentage for the current group of X runs.
      const flakinessPercentage = (failedRuns / relevantRuns) * 100;

      // Add the flakiness percentage to the flakinessData array.
      flakinessData.push(flakinessPercentage);
    }

    // Store the flakiness data for the current test case in the flakinessTrend object.
    flakinessTrend[testCase.name] = flakinessData;
  }

  // Return the flakiness trend object.
  return flakinessTrend;
}

const FlakinessTrend = ({ data }: { data: TestCase[] }) => {
  const [testData, setTestData] = useState<TestCase[]>();
  const [flakinessTrend, setFlakinessTrend] = useState<{
    [key: string]: number[];
  }>({});
  const xRuns = 20;

  useEffect(() => {
    setTestData(data);
    const trend = calculateFlakinessTrend(data, xRuns);
    setFlakinessTrend(trend);
  }, []);

  const chartData = testData
    ? {
        labels: Array.from(
          { length: Math.ceil(testData[0]?.total_runs / xRuns) || 0 },
          (_, i) => i * xRuns
        ),
        datasets: testData.map((testCase, index) => ({
          label: testCase.name,
          data: flakinessTrend[testCase.name] || [],
          borderColor: `rgba(${(index * 40) % 255},${(index * 80) % 255},${
            (index * 120) % 255
          },1)`,
          borderWidth: 2,
          fill: false,
        })),
      }
    : null;

  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Groups of X Runs",
        },
      },
      y: {
        title: {
          display: true,
          text: "Flakiness %",
        },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div>
      <h2>Flakiness Trend</h2>
      {chartData && <Line data={chartData} options={chartOptions} />}
      {!chartData && <span>No data loaded!</span>}
    </div>
  );
};

export default FlakinessTrend;
