import { useState, useEffect } from "react";
import Stats from "./components/Stats";
import PieChart from "./components/PieChart";
import { getRuns } from "./api/sauce.api";

function App() {
  // const [testResults, setTestResults] = useState<Record<string, any>>();
  const [runsResults, setRunsResults] = useState<Record<string, any>>();
  const [tableData, setTableData] = useState<Record<string, any>>();
  const [rowsInput, setRowsInput] = useState<number>(50);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const runs = await getRuns();
    if (runs) {
      setRunsResults(runs);
    }
    setLoading(false);
  };

  const filterData = () => {
    const data = { ...runsResults };
    if (data) {
      data.test_cases = data.test_cases?.slice(0, rowsInput);
      setTableData(data);
    }
    return data;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [runsResults]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // Fetch the data from the local JSON file and update the state
  //     const response = await fetch("testResults.json");
  //     const json = await response.json();
  //     setTestResults(json);
  //   };

  //   fetchData();
  // }, []);

  const handleChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    if (!Number.isNaN(value)) {
      setRowsInput(value);
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    filterData();
  };

  return (
    <div className="relative mx-auto">
      <h1 className="p-3 text-2xl h-14 align-middle text-center bg-blue-900 text-blue-200 font-bold">
        Test Runs Stats
      </h1>
      <div className="px-2 py-1 h-8 align-middle bg-slate-200 text-sm font-bold">
        {loading && <span>Loading data...</span>}
      </div>
      <div className="px-8">
        {tableData?.statuses && (
          <div className="w-80 mx-auto">
            <PieChart statuses={tableData.statuses} title="Total runs status" />
          </div>
        )}

        <div className="mt-10">
          <form onSubmit={handleSubmit}>
            <label htmlFor="quantity" className="mr-2">Items to display:</label>
            <input
              type="number"
              id="quantity"
              value={rowsInput}
              onChange={handleChange}
              className="input input-bordered input-sm"
            />
            <button type="submit" className="btn btn-sm ml-2">Save</button>
          </form>
          {tableData?.test_cases && (
            <div className="mt-4 text-sm">
              Showing {tableData.test_cases.length} of {tableData.total}{" "}
              records.
            </div>
          )}
          <div className="my-5 overflow-hidden rounded-lg border border-blue-300">
            <Stats data={tableData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
