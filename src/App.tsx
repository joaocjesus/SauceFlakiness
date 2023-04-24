import { useState, useEffect } from "react";
import "./App.css";
import Stats from "./components/Stats";
import PieChart from "./components/PieChart";
import { getRuns } from "./api/sauce.api";
// import axios from "axios";

function App() {
  const [testResults, setTestResults] = useState<Record<string, any>>();
  const [runsResults, setRunsResults] = useState<Record<string, any>>({
    statuses: {
      passed: 0,
      failed: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch the data from the local JSON file and update the state
      const runs = await getRuns();
      setRunsResults(runs);
    };

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
    <>
      <h1>Dynamic JSON Table</h1>
      <div className="content">
        <div className="stats">
          <Stats data={runsResults} />
        </div>
        <div className="chart">
          <PieChart statuses={runsResults.statuses} />
        </div>
      </div>
    </>
  );
}

export default App;
