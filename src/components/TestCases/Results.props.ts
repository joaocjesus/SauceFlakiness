enum TableOrder {
    ASC = "asc",
    DESC = "desc",
}

type KeyArray = Array<{ [key: string]: any }>;

interface SortProps {
    column: string;
    order: TableOrder.ASC | TableOrder.DESC;
}

interface HeaderStyleProps {
    name: string;
    index?: number;
    style: string;
}

interface ResultsProps {
    data: KeyArray;
    title?: string;
    sort?: SortProps;
    totalsRow?: "above" | "below";
    filter?: { column: string; inputLabel: string };
    getTableData?: Function;
    headerStyle?: HeaderStyleProps[];
    rowsQuantity?: string;
    onRowsChange?: Function;
    onRowClick?: Function;
}

export { TableOrder };
export type { SortProps, HeaderStyleProps, ResultsProps, KeyArray };
