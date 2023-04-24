import { useState, useEffect, SetStateAction } from "react";
import "./App.css";
import Stats from "./components/Stats";
import PieChart from "./components/PieChart";
import { getRuns } from "./api/sauce.api";

function App() {
  // const [testResults, setTestResults] = useState<Record<string, any>>();
  const [runsResults, setRunsResults] = useState<Record<string, any>>();
  const [tableData, setTableData] = useState<Record<string, any>>();
  const [rowsInput, setRowsInput] = useState<number>(50);

  const fetchData = async () => {
    // Fetch the data from the local JSON file and update the state
    const runs = await getRuns();
    setRunsResults(runs);
    filterData();
  };

  const filterData = () => {
    const data = { ...runsResults };
    if (data) {
      data.test_cases = data.test_cases.slice(0, rowsInput);
      setTableData(data);
    }
    return data;
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

  const handleChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    if (!Number.isNaN(value)) {
      setRowsInput(value);
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("Updated");
    filterData();
  };

  return (
    <>
      <h1>Test Runs Stats</h1>
      <div className="content">
        <div className="chart">
          {tableData && (
            <PieChart statuses={tableData.statuses} title="Total runs status" />
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="quantity">Items to display:</label>
          <input
            type="number"
            id="quantity"
            value={rowsInput}
            onChange={handleChange}
          />
          <button type="submit">Save</button>
        </form>
        <div className="stats">
          {tableData && (
            <div>
              Showing {tableData.test_cases.length} of {tableData.total}{" "}
              records.
            </div>
          )}
          <Stats data={tableData} />
        </div>
      </div>
    </>
  );
}

export default App;
