import { getFailedTests } from "../helpers/statsUtils";
import Table from "./Table";

const Stats = ({ data, maxRows }: { data: any; maxRows?: number }) => {
  const failedTests = getFailedTests(data);
  return (
    <Table data={failedTests} totalsRow="above" />
  );
};

export default Stats;
