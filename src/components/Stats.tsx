import { getFailedTests } from "../helpers/statsUtils";
// import "./Stats.css";
import Table from "./Table";

const Stats = ({ data, maxRows }: { data: any; maxRows?: number }) => {
  const failedTests = getFailedTests(data);
  return (
    <div>
      <Table data={failedTests} totalsRow="above" />
    </div>
  );
};

export default Stats;
