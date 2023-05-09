import { useState, useEffect } from "react";
import PieChart from "./components/PieChart";
import { getTestCases } from "./api/sauce.api";
import FlakinessTrend from "./components/FlakinessTrend";
import { TestCases, TestCase, Error } from "./types/Tests.type";
import Table, { Order } from "./components/Table";
import CollapsibleRow from "./components/CollapsibleRow";

const statusError = (title: string, result?: TestCases | Error): string => {
  let error;
  if (result && "detail" in result) {
    error = result?.detail;
  }
  return error ? `${title}: ${error}` : `${title}!`;
};

export interface TestResults {
  name: string;
  passed?: number;
  failed?: number;
  error?: number;
  complete?: number;
  total_runs: number;
}

function App() {
  const [tests, setTests] = useState<TestCases>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const [testData, setTestData] = useState<TestResults[]>();

  const setFilteredData = (results: TestResults[]) => {
    Logger.log("Results: ", results);
  };

  const initData = async () => {
    setError(null);
    setLoading(true);

    setTestData(undefined);
    setTests(undefined);

    const testCases: TestCases = await getTestCases();

    if (testCases?.test_cases) {
      const filteredTable = testCases.test_cases.map((row) => ({
        name: row.name,
        passed: Number(row.statuses?.passed) || 0,
        failed: Number(row.statuses?.failed) || 0,
        error: Number(row.statuses?.error) || 0,
        complete: Number(row.statuses?.complete) || 0,
        total_runs: Number(row.total_runs),
      }));
      if (filteredTable) {
        setTestData(filteredTable);
      }
      setTests(testCases);
    } else {
      setLoading(false);
      setError(statusError("Error fetching data", testCases));
    }
    setLoading(false);
  };

  useEffect(() => {
    initData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // Fetch the data from the local JSON file and update the state
  //     const response = await fetch("testResults.json");
  //     const json = await response.json();
  //     setTestResults(json);
  //   };

  //   fetchData();
  // }, []);

  const tableStyles = [{ name: "Name", style: "w-4/6" }];
  const collapsibleStyle = "border border-1 p-2";

  return (
    <div className="relative mx-auto">
      <h1 className="p-3 text-2xl h-14 align-middle text-center bg-primary text-white font-bold">
        SauceLabs Stats
      </h1>
      <div className="px-2 py-1 h-8 align-middle bg-slate-200 text-sm">
        {loading && <span className="text-primary">Loading data...</span>}
        {error && <span className="text-error mt-1 text-sm">{error}</span>}
        <button
          className="btn btn-primary btn-xs float-right"
          onClick={initData}
        >
          Reload
        </button>
      </div>
      <div className="px-8">
        {!loading && (
          <>
            {tests && (
              <div className="m-2 grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <CollapsibleRow
                    label="Results PieChart"
                    classes={collapsibleStyle}
                    content={
                      <PieChart
                        statuses={tests?.statuses}
                        title="Total runs status"
                        classes="content-center p-10"
                      />
                    }
                  />
                </div>
                <div className="col-span-2">
                  <CollapsibleRow
                    label="Flakiness Chart"
                    classes={collapsibleStyle}
                    content={
                      <FlakinessTrend
                        classes="content-center p-10"
                        data={tests.test_cases}
                      />
                    }
                  />
                </div>
              </div>
            )}

            <div className="mt-10">
              {testData && (
                <Table
                  data={testData}
                  title="Test Results"
                  sort={{ column: "failed", order: Order.DESC }}
                  totalsRow="above"
                  filter={{
                    column: "name",
                    inputLabel: "Filter by test name:",
                  }}
                  getTableData={setFilteredData}
                  headerStyle={tableStyles}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
