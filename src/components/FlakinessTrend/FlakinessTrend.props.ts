type KeyNumArray = {
    [key: string]: number[];
}

interface AggregatedData {
    aggregatedTrends?: KeyNumArray,
    maxBlocks?: number,
    testQuantity?: number,
    totalPercentage?: number
}

interface ChartData {
    labels: number[];
    datasets: {
        label: string;
        data: any;
        borderColor: string;
        borderWidth: number;
        fill: boolean;
    }[];
}

export type { AggregatedData, ChartData, KeyNumArray }
