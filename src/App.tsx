import { useState, useEffect } from "react";
import { CollapsibleRow, FlakinessTrend, PieChart, Table } from "components";
import { getTestCases } from "api/sauce.api";
import { TestCases, TestCase, Error, TestStatuses } from "types/Tests.type";
import { TableOrder } from "components/Table/Table.props";

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
  const [testCases, setTestCases] = useState<TestCases>();
  const [tableData, setTableData] = useState<TestResults[]>();
  const [filteredTable, setFilteredTable] = useState<TestResults[]>();
  const [chartData, setChartData] = useState<TestStatuses>();
  const [flakinessData, setFlakinessData] = useState<TestCase[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  // Read floatPanels from localStorage
  const [floatPanels, setFloatPanels] = useState<boolean>(
    JSON.parse(localStorage.getItem("floatPanels") || "false")
  );

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    const testCasesResults: TestCases = await getTestCases();
    setLoading(false);

    if (testCasesResults) {
      setTestCases(testCasesResults);
    } else {
      setError(statusError("Error fetching data", testCasesResults));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (testCases) {
      const filtered = testCases.test_cases.map((row) => ({
        name: row.name,
        passed: Number(row.statuses?.passed) || 0,
        failed: Number(row.statuses?.failed) || 0,
        error: Number(row.statuses?.error) || 0,
        complete: Number(row.statuses?.complete) || 0,
        total_runs: Number(row.total_runs),
      }));
      if (filtered) {
        setTableData(filtered);
      }
      setChartData(testCases.statuses);
      setFlakinessData(testCases.test_cases);
    }
  }, [testCases]);

  useEffect(() => {
    const results = filteredTable?.map((result) => result.name);
    const filteredTests = testCases?.test_cases?.filter(({ name }) =>
      results?.includes(name)
    );
    setFlakinessData(filteredTests);
  }, [filteredTable]);

  const handleFloatPanelsChange = () => {
    // Save floatPanels to localStorage
    localStorage.setItem("floatPanels", JSON.stringify(!floatPanels));
    setFloatPanels(!floatPanels);
  };

  const tableStyles = [{ name: "Name", style: "w-4/6" }];
  const collapsibleStyle =
    "bg-white border border-accent p-2 rounded-lg w-full";

  return (
    <div className="relative mx-auto">
      <h1 className="p-3 text-2xl h-14 text-center bg-primary text-white font-bold">
        SauceLabs Stats
      </h1>
      <div className="px-2 py-1 h-8 bg-slate-200 text-sm align-middle">
        {loading && <span className="text-primary">Loading data...</span>}
        {error && <span className="text-error mt-1 text-sm">{error}</span>}
        <button
          className="btn btn-primary btn-xs float-right"
          onClick={fetchData}
        >
          Reload
        </button>
        <label className="float-right mx-5 mt-1">
          <input
            className="mx-2"
            type="checkbox"
            checked={floatPanels}
            onChange={handleFloatPanelsChange}
          />
          Float panels
        </label>
      </div>
      <div className="px-8 py-4">
        {!loading && (
          <>
            <div className="grid grid-cols-3 gap-2">
              {/* Test Results Chart */}
              {chartData && (
                <div className="col-span-1">
                  <CollapsibleRow
                    label="Results PieChart"
                    classes={collapsibleStyle}
                    floatContent={floatPanels}
                    content={
                      <PieChart
                        statuses={chartData}
                        title="Total runs status"
                        classes="p-10"
                      />
                    }
                  />
                </div>
              )}
              {/* Flakiness trends */}
              {flakinessData && (
                <div className="col-span-2">
                  <CollapsibleRow
                    label="Flakiness Chart"
                    classes={collapsibleStyle}
                    floatContent={floatPanels}
                    content={
                      <FlakinessTrend
                        classes="p-5 text-center h-[540px]"
                        data={flakinessData}
                      />
                    }
                  />
                </div>
              )}
            </div>
            {/* Results Table */}
            <div className="mt-4">
              <Table
                data={tableData}
                title="Test Results"
                sort={{ column: "failed", order: TableOrder.DESC }}
                totalsRow="above"
                filter={{
                  column: "name",
                  inputLabel: "Filter by test name:",
                }}
                getTableData={setFilteredTable}
                headerStyle={tableStyles}
              />
            </div>
          </>
        )}
        {loading && <span>Maybe loading data?!</span>}
      </div>
    </div>
  );
}

export default App;
