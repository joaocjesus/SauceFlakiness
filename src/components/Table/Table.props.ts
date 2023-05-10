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

interface TableProps {
    data: KeyArray;
    title?: string;
    sort?: SortProps;
    totalsRow?: "above" | "below";
    filter?: { column: string; inputLabel: string };
    getTableData?: Function;
    headerStyle?: HeaderStyleProps[];
}

export { TableOrder };
export type { SortProps, HeaderStyleProps, TableProps, KeyArray };
