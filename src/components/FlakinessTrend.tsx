import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { TestCase } from "../types/Tests.type";
import "chart.js/auto";

type ObjArray = {
  [key: string]: number[];
}

const calculateFlakinessTrend = (
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

const calculateAggregateTrend = (trend?: ObjArray) => {
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

type AggregatedData = {
  aggregatedTrends?: ObjArray,
  maxBlocks?: number,
  testQuantity?: number,
  totalPercentage?: number
}

type ChartData = {
  labels: number[];
  datasets: {
    label: string;
    data: any;
    borderColor: string;
    borderWidth: number;
    fill: boolean;
  }[];
}

const FlakinessTrend = ({
  data,
  title,
  classes,
}: {
  data: TestCase[];
  title?: string;
  classes?: string;
}) => {
  const [testData, setTestData] = useState<TestCase[]>();
  const [flakinessTrend, setFlakinessTrend] = useState<ObjArray>({});
  const [aggregatedResults, setAggregatedResults] = useState<AggregatedData>();
  const [trendData, setTrendData] = useState<ObjArray>();
  const [showAggregate, setShowAggregate] = useState(false);
  const [chartData, setChartData] = useState<ChartData>();
  const xRuns = 40;

  useEffect(() => {
    setTestData(data);
    const trend = calculateFlakinessTrend(data, xRuns);
    setFlakinessTrend(trend);
    setTrendData(trend);

    const aggregatedObject = calculateAggregateTrend(flakinessTrend);
    setAggregatedResults(aggregatedObject);
  }, [data]);

  useEffect(() => {
    showAggregate
      ? setTrendData(aggregatedResults?.aggregatedTrends)
      : setTrendData(flakinessTrend);
  }, [showAggregate]);

  useEffect(() => {
    const chartDataObj = getChartData();
    setChartData(chartDataObj);
  }, [trendData]);

  const toggleDisplay = () => {
    setShowAggregate(!showAggregate);
  }

  const getChartData = () => {
    if (testData) {
      return showAggregate
        ? {
          labels: Array.from(
            { length: Math.ceil(testData[0]?.total_runs / xRuns) || 0 },
            (_, i) => i * xRuns
          ),
          datasets: aggregatedResults?.aggregatedTrends
            ? Object.entries(aggregatedResults.aggregatedTrends).map((item) => ({
              label: '',
              data: item[1] || [],
              borderColor: 'rgba(40,80,120,1)',
              borderWidth: 2,
              fill: false,
            }))
            : []
        }
        : {
          labels: Array.from(
            { length: Math.ceil(testData[0]?.total_runs / xRuns) || 0 },
            (_, i) => i * xRuns
          ),
          datasets: testData.map((testCase, index) => ({
            label: testCase.name,
            data: flakinessTrend[testCase.name] || [],
            borderColor: `rgba(${(index * 40) % 255},${(index * 80) % 255},${(index * 120) % 255
              },1)`,
            borderWidth: 2,
            fill: false,
          }))
        }
    }
  }

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
    <div className={classes}>
      <h2>{title}</h2>
      <h4 className="-mt-5 text-xs">{showAggregate ? 'aggregate' :  'per test'}</h4>
      {chartData && (
        <Line
          className="content-center"
          data={chartData}
          options={chartOptions}
        />
      )}
      <button className="btn btn-primary btn-xs mt-5" onClick={toggleDisplay}>Toggle Display</button>
    </div>
  );
};

export default FlakinessTrend;
