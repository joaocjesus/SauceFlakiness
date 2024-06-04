import { TestCase } from "../../types/Tests.type";
import CollapsibleRow from "../CollapsibleRow";
import FlakinessTrend from "../FlakinessTrend/FlakinessTrend";

const collapsibleStyle = 'bg-white border border-accent p-2 rounded-lg w-full';

interface Props {
  flakinessData?: TestCase[];
  float?: boolean;
}

export const FlakinessChart = ({ flakinessData, float }: Props) => {
  return <>
    {/* Flakiness trends */}
    {flakinessData && <div className="col-span-2">
      <CollapsibleRow
        label="Flakiness Chart"
        classes={collapsibleStyle}
        floatContent={float}
        content={
          <FlakinessTrend classes="p-5 text-center" data={flakinessData} />
        }
      />
    </div>}
  </>
}