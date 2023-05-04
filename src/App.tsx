import { useState, useEffect } from "react";
import PieChart from "./components/PieChart";
import { getTestCases } from "./api/sauce.api";
import { log } from "./helpers/log";
import FlakinessTrend from "./components/FlakinessTrend";
import { TestCases, TestResult } from "./types/Tests.type";
import { getFailedTests } from "./helpers/statsUtils";
import Table from "./components/Table";

const getError = (title: string, result?: TestCases): string => {
  const errorMsg = result?.detail || null;
  log("Error(): ", errorMsg);
  return errorMsg ? `${title}: ${errorMsg}` : `${title}!`;
};

function App() {
  // const [testResults, setTestResults] = useState<Record<string, any>>();
  const [testCases, setTestCases] = useState<TestCases>();
  const [failedTests, setFailedTests] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    const testCases: TestCases = await getTestCases();
    setFailedTests(getFailedTests(testCases.test_cases));
    setLoading(false);

    if (testCases?.test_cases) {
      setTestCases(testCases);
    } else {
      setError(getError("Error fetching data", testCases));
    }
    log("Tests Cases: ", testCases);
  };

  useEffect(() => {
    fetchData();
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
        {testCases?.statuses && (
          <div className="w-80 mx-auto">
            <PieChart statuses={testCases.statuses} title="Total runs status" />
          </div>
        )}

        <div className="mt-10">
          {testCases?.test_cases && <Table data={failedTests} totalsRow="above" />}
        </div>
      </div>
      {testCases && <FlakinessTrend data={testCases} />}
    </div>
  );
}

export default App;
