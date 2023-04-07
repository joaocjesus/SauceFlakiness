import { getFailedTests } from "../helpers/statsUtils";
import "./Stats.css";

const Stats = ({ data }: { data: any }) => {
  const failedTests = getFailedTests(data);
  return (
    <div>
      <table className="table">
        <thead className="table-header">
          <tr>
            <td>Test name</td>
            <td>Failed #</td>
            <td>Failed %</td>
            <td>Passed #</td>
            <td>Passed %</td>
            <td>Runs</td>
          </tr>
        </thead>
        <tbody className="table-body">
          {failedTests.map(({ name, failed, passed, total_runs }) => (
            <tr>
              <td className="test-name">Test: {name} </td>
              <td className="failed">{failed}</td>
              <td className="failed">
                {((failed / total_runs) * 100).toFixed(2)}%
              </td>
              <td className="passed">{passed}</td>
              <td className="passed">
                {((passed / total_runs) * 100).toFixed(2)}%
              </td>
              <td className="runs">{total_runs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stats;
