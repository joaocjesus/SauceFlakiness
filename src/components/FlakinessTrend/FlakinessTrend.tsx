import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { TestCase } from "../../types/Tests.type";
import { AggregatedData, ChartData, KeyNumArray } from "./FlakinessTrend.props";

import "chart.js/auto";
import {
  calculateAggregateTrend,
  calculateFlakinessTrend,
} from "../../helpers/flakiness";

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
  const [flakinessTrend, setFlakinessTrend] = useState<KeyNumArray>({});
  const [aggregatedResults, setAggregatedResults] = useState<AggregatedData>();
  const [trendData, setTrendData] = useState<KeyNumArray>();
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
  };

  const getChartData = () => {
    if (testData) {
      return showAggregate
        ? {
            labels: Array.from(
              { length: Math.ceil(testData[0]?.total_runs / xRuns) || 0 },
              (_, i) => i * xRuns
            ),
            datasets: aggregatedResults?.aggregatedTrends
              ? Object.entries(aggregatedResults.aggregatedTrends).map(
                  (item) => ({
                    label: "",
                    data: item[1] || [],
                    borderColor: "rgba(40,80,120,1)",
                    borderWidth: 2,
                    fill: false,
                  })
                )
              : [],
          }
        : {
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
          };
    }
  };

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
      <h4 className="-mt-5 text-xs">
        {showAggregate ? "aggregate" : "per test"}
      </h4>
      {chartData && (
        <Line
          className="content-center"
          data={chartData}
          options={chartOptions}
        />
      )}
      <button className="btn btn-primary btn-xs mt-5" onClick={toggleDisplay}>
        Toggle Display
      </button>
    </div>
  );
};

export default FlakinessTrend;
