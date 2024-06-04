import { useState, useEffect } from "react";
import { getTestCases } from "../../api/sauce.api";
import { TestCases, TestCase, Error, TestStatuses } from "../../types/Tests.type";
import TestCasesResults from "./TestCasesResults";
import { TableOrder } from "./Results.props";
import { ResultsChart } from "../Charts/ResultsChart";
import { FlakinessChart } from "../Charts/FlakinessChart";
import { InfoPanel } from "../InfoPanel";
import { toPascalCase } from "../../helpers/helpers";
import { Paper, Table, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

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
  avg_duration: string;
  complete_rate: string;
  error_rate: string;
  fail_rate: string;
  pass_rate: string;
}

export const TestCasesContainer = () => {
  const [sourceData, setSourceData] = useState<TestCase[]>();
  const [tableData, setTableData] = useState<Partial<TestResults>[]>();
  const [chartData, setChartData] = useState<TestStatuses>();
  const [flakinessData, setFlakinessData] = useState<TestCase[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const [floatPanels, setFloatPanels] = useState(true);
  const [testQuantity, setTestQuantity] = useState('5000');
  const [infoPanelVisible, setInfoPanelVisible] = useState(false);
  const [testDetails, setTestDetails] = useState<TestResults>();

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    fetchTests();
  }, [testQuantity]);

  useEffect(() => {

  }, [testDetails]);

  const fetchTests = async () => {
    setError(null);
    setLoading(true);

    setTableData(undefined);
    setChartData(undefined);
    setFlakinessData(undefined);

    const testCases: TestCases = await getTestCases(testQuantity);

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

  const getTestCase = (testCaseName: string) => {
    return sourceData?.find(({ name }) => name === testCaseName)
  }

  const handleFloatPanelsChange = () => {
    setFloatPanels(!floatPanels);
  }

  const handleTestQuantityChange = (quantity: string) => {
    setTestQuantity(quantity);
  }

  const handleInfoPanelOnClose = () => {
    setInfoPanelVisible(false);
  }

  const prettifyProp = (prop: string) => {
    return toPascalCase(prop.replace(/_/g, ' '));
  }

  const handleRowClick = (test: string) => {
    const testCaseData = getTestCase(test);
    if (testCaseData) {
      const details = {
        name: testCaseData.name,
        passed: testCaseData.statuses?.passed || 0,
        failed: testCaseData.statuses?.failed || 0,
        error: testCaseData.statuses?.error || 0,
        complete: testCaseData.statuses?.complete || 0,
        total_runs: testCaseData.total_runs || 0,
        avg_duration: (testCaseData.avg_duration || 0).toFixed(0) + 's',
        complete_rate: (testCaseData.complete_rate * 100 || 0).toFixed(2) + '%',
        error_rate: (testCaseData.error_rate * 100 || 0).toFixed(2) + '%',
        fail_rate: (testCaseData.fail_rate * 100 || 0).toFixed(2) + '%',
        pass_rate: (testCaseData.pass_rate * 100 || 0).toFixed(2) + '%',
      }
      setTestDetails(details);
      setInfoPanelVisible(true);
    }
  }

  const tableStyles = [{ name: "Name", style: "w-4/6 p-2" }];

  return (
    <div className="relative mx-auto">
      <div className="px-2 py-1 h-8 bg-slate-200 text-sm align-middle">
        {loading && <span className="text-primary">Loading data...</span>}
        {error && <span className="text-error mt-1 text-sm">{error}</span>}
        <button
          className="btn btn-primary btn-xs float-right"
          onClick={fetchTests}
        >
          Reload
        </button>
        <label className="float-right mx-5 mt-1">
          <input className="mx-2" type="checkbox" checked={floatPanels} onChange={handleFloatPanelsChange} />
          Float panels
        </label>
      </div>
      <div className="px-8 py-4">
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
              rowsQuantity={testQuantity}
              onRowsChange={handleTestQuantityChange}
              onRowClick={handleRowClick}
            />
          )}
        </div>
        {infoPanelVisible && <InfoPanel
          open={infoPanelVisible}
          onClose={handleInfoPanelOnClose}
          title='Testcase Details'
        >
          <TableContainer component={Paper}>
            {testDetails && <Table sx={{ minWidth: 400 }}>
              {Object.entries(testDetails).map(item => (
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} className="border">
                  <TableCell sx={{ fontWeight: 'bold', width: 150 }} component="th" scope="row">{prettifyProp(item[0])}</TableCell>
                  <TableCell scope="row" className="font-light">{item[1]}</TableCell>
                </TableRow>
              ))}
            </Table>}
            {!testDetails && <div>No details?</div>}
          </TableContainer>
        </InfoPanel>}
      </div>
    </div>
  );
}
