import { useState, useEffect } from "react";
import { getTestCases } from "../../api/sauce.api";
import { TestCases, TestCase, Error, TestStatuses } from "../../types/Tests.type";
import TestCasesResults from "./TestCasesResults";
import { TableOrder } from "./Results.props";
import { ResultsChart } from "../Charts/ResultsChart";
import { FlakinessChart } from "../Charts/FlakinessChart";

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

export const TestCasesContainer = () => {
  const [sourceData, setSourceData] = useState<TestCase[]>();
  const [tableData, setTableData] = useState<TestResults[]>();
  const [chartData, setChartData] = useState<TestStatuses>();
  const [flakinessData, setFlakinessData] = useState<TestCase[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const [floatPanels, setFloatPanels] = useState(true);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setError(null);
    setLoading(true);

    setTableData(undefined);
    setChartData(undefined);
    setFlakinessData(undefined);

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
        setTableData(filteredTable);
      }
      setSourceData(testCases.test_cases);
      setChartData(testCases.statuses);
      setFlakinessData(testCases.test_cases);
    } else {
      setLoading(false);
      setError(statusError("Error fetching data", testCases));
    }
    setLoading(false);
  };

  const getTableResults = (tableResults: TestResults[]) => {
    const results = tableResults?.map(result => result.name);
    const filteredTests = sourceData?.filter(({ name }) => results?.includes(name));
    if (filteredTests) {
      setFlakinessData(filteredTests);
    }
  };

  const handleFloatPanelsChange = () => {
    setFloatPanels(!floatPanels);
  }

  const tableStyles = [{ name: "Name", style: "w-4/6" }];

  return (
    <div className="relative mx-auto">
      <div className="px-2 py-1 h-8 bg-slate-200 text-sm align-middle">
        {loading && <span className="text-primary">Loading data...</span>}
        {error && <span className="text-error mt-1 text-sm">{error}</span>}
        <button
          className="btn btn-primary btn-xs float-right"
          onClick={initData}
        >
          Reload
        </button>
        <label className="float-right mx-5 mt-1">
          <input className="mx-2" type="checkbox" checked={floatPanels} onChange={handleFloatPanelsChange} />
          Float panels
        </label>
      </div>
      <div className="px-8 py-4">
        {!loading && (
          <>
            {/* Charts */}
            <div className="grid grid-cols-3 gap-2">
              <ResultsChart chartData={chartData} float={floatPanels} />
              <FlakinessChart flakinessData={flakinessData} float={floatPanels} />
            </div>

            {/* Results */}
            <div className="mt-4">
              {tableData && (
                <TestCasesResults
                  data={tableData}
                  title="Test Results"
                  sort={{ column: "failed", order: TableOrder.DESC }}
                  totalsRow="above"
                  filter={{
                    column: "name",
                    inputLabel: "Filter by test name:",
                  }}
                  getTableData={getTableResults}
                  headerStyle={tableStyles}
                />
              )}
            </div>
          </>
        )}
        {loading && <span>Maybe loading data?!</span>}
      </div>
    </div>
  );
}
