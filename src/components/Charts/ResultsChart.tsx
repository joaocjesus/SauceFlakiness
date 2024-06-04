import { TestStatuses } from "../../types/Tests.type";
import CollapsibleRow from "../CollapsibleRow";
import PieChart from "./PieChart";

const collapsibleStyle = 'bg-white border border-accent p-2 rounded-lg w-full';

interface Props {
    chartData?: TestStatuses;
    float?: boolean;
}

export const ResultsChart = ({chartData, float}: Props) => {
    return <>
        {/* Test Results Chart */}
        {chartData && <div className="col-span-1">
        <CollapsibleRow
          label="Results PieChart"
          classes={collapsibleStyle}
          floatContent={float}
          content={
            <PieChart
              statuses={chartData}
              title="Total runs status"
              classes="p-10"
            />
          }
        />
      </div>}
    </>
}