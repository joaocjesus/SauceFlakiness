import { useState, useEffect } from "react";
import PieChart from "./components/PieChart";
import { getTestCases } from "./api/sauce.api";
import { log } from "./helpers/log";
import FlakinessTrend from "./components/FlakinessTrend";
import { TestCase, TestCases, TestResult } from "./types/Tests.type";
import Tests from "./helpers/Tests";
import Table from "./components/Table";

const getError = (title: string, result?: TestCases): string => {
  const errorMsg = result?.detail || null;
  log("Error(): ", errorMsg);
  return errorMsg ? `${title}: ${errorMsg}` : `${title}!`;
};

function App() {
  const [tests, setTests] = useState<Tests>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const [tableData, setTableData] = useState<TestResult[]>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    const testCases: TestCases = await getTestCases();
    setLoading(false);

    if (testCases) {
      setTests(new Tests(testCases));
    } else {
      setError(getError("Error fetching data", testCases));
    }
  };

  const setFilteredTable = (testcases: TestCases) => {
    if(tests && testcases) {
      tests.setData(testcases);

    const filteredTable = tests.testResults().map(row => ({
      name: row.name,
      passed: Number(row.passed),
      failed: Number(row.failed),
      total_runs: Number(row.total_runs)
    }));
    log('Filtered Table: ', filteredTable)
    if (filteredTable)
      setTableData(filteredTable);
  }
  }

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
          {tests &&
            <Table
              source={tests}
              dataToRender={tests.failedTests()}
              totalsRow="above"
              filterRow={{ key: 'name', label: 'Filter by test name:' }}
              getTable={setFilteredTable}
            />
          }
        </div>
      </div>
      {tests && <FlakinessTrend data={tests.testCases()} />}
    </div>
  );
}

export default App;
