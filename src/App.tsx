import { useState, useEffect } from "react";
import PieChart from "./components/PieChart";
import { getTestCases } from "./api/sauce.api";
import FlakinessTrend from "./components/FlakinessTrend";
import { TestCases, TestCase, Error } from "./types/Tests.type";
import Tests from "./helpers/Tests";
import Table from "./components/Table";

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
  const [tests, setTests] = useState<Tests>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const [tableData, setTableData] = useState<TestResults[]>([]);

  const setFilteredTable = (testcases: TestCases) => {
    if (testcases) {
      const filteredTable = testcases.test_cases.map((row) => ({
        name: row.name,
        passed: Number(row.statuses?.passed) || 0,
        failed: Number(row.statuses?.failed) || 0,
        error: Number(row.statuses?.error) || 0,
        complete: Number(row.statuses?.complete) || 0,
        total_runs: Number(row.total_runs),
      }));
      if (filteredTable) {
        setTableData(filteredTable);
      }
    }
  };

  useEffect(() => {
    (async () => {
      setError(null);
      setLoading(true);
      const testCases: TestCases = await getTestCases();
      setLoading(false);
      if (testCases) {
        setFilteredTable(testCases);
        Logger.warn(testCases);
        setTests(new Tests(testCases));
      } else {
        setError(statusError("Error fetching data", testCases));
      }
    })();
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

  return (
    <div className="relative mx-auto">
      <h1 className="p-3 text-2xl h-14 align-middle text-center bg-blue-900 text-blue-200 font-bold">
        Test Runs Stats
      </h1>
      <div className="px-2 py-1 h-8 align-middle bg-slate-200 text-sm">
        {loading && <span>Loading data...</span>}
        {error && <span className="text-red-500 mt-1 text-sm">{error}</span>}
      </div>
      <div className="px-8">
        {tests && (
          <div className="w-80 mx-auto">
            <PieChart statuses={tests?.statuses()} title="Total runs status" />
          </div>
        )}

        <div className="mt-10">
          {tests && (
            <Table
              source={tests}
              dataToRender={tableData}
              totalsRow="above"
              filterRow={{ key: "name", label: "Filter by test name:" }}
              getTable={setFilteredTable}
            />
          )}
        </div>
      </div>
      {tests && <FlakinessTrend data={tests.testCases()} />}
    </div>
  );
}

export default App;
