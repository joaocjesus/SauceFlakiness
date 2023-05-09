import { useEffect, useState } from "react";
import { sortArray } from "../helpers/helpers";

export enum Order {
  ASC = "asc",
  DESC = "desc",
}

const SORT_ASC_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width={1.5}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M4.5 15.75l7.5-7.5 7.5 7.5"
    />
  </svg>
);

const SORT_DESC_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);

type ArrayOfObjects = Array<{ [key: string]: any }>;

interface SortProps {
  column: string;
  order: Order.ASC | Order.DESC;
}

interface HeaderStyleProps {
  name: string;
  index?: number;
  style: string;
}

interface TableProps {
  data: ArrayOfObjects;
  title?: string;
  sort?: SortProps;
  totalsRow?: "above" | "below";
  filter?: { column: string; inputLabel: string };
  getTableData?: Function;
  headerStyle?: HeaderStyleProps[];
}

const Table = ({
  data,
  title,
  sort,
  totalsRow = "above",
  filter,
  getTableData,
  headerStyle,
}: TableProps) => {
  const defaultSort = () => ({
    column: Object.keys(data[0])[0],
    order: Order.ASC,
  });

  const [testNameFilter, setTestNameFilter] = useState<string>("");
  const [tableData, setTableData] = useState<ArrayOfObjects>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnSort, setColumnSort] = useState<SortProps>(sort || defaultSort);

  useEffect(() => {
    setHeaders(Object.keys(data[0]));

    const sortedData = sortData(data);
    setTableData(sortedData || data);
  }, []);

  useEffect(() => {
    const sortedData = sortData(data);
    setTableData(sortedData || data);
  }, [columnSort]);

  useEffect(() => {
    if (getTableData) {
      getTableData(tableData);
    }
  }, [tableData]);

  useEffect(() => {
    if (testNameFilter) {
      const filterUpdate = setTimeout(() => filterData(), 500);
      return () => clearTimeout(filterUpdate);
    }
  }, [testNameFilter]);

  const filterData = () => {
    const sourceData = tableData?.length > 0 ? [...tableData] : [...data];

    // Filter rows based on column value, if <filter> parameter was specified
    const filtered = filter
      ? [...sourceData].filter((row) =>
          row[filter.column]
            .toLowerCase()
            .includes(testNameFilter.toLowerCase())
        )
      : sourceData;

    setTableData(filtered);
  };

  const sortData = (sourceData: ArrayOfObjects) => {
    let { column, order } = columnSort;

    // Sort data if <sort> parameter was specified
    const sortedData = sortArray({
      column,
      order,
      array: sourceData,
    });

    return sortedData;
  };

  const getIcon = (order: Order) => {
    switch (order) {
      case Order.ASC:
        return SORT_ASC_ICON;
      case Order.DESC:
        return SORT_DESC_ICON;
    }
  };

  const isSortedHeader = (header: string) =>
    columnSort?.column?.toLowerCase() === header?.toLowerCase();

  const formattedHeader = (header: string) => {
    let sortIcon = <></>;
    if (isSortedHeader(header)) {
      sortIcon = getIcon(columnSort.order);
    }

    const normalized = header.replaceAll(/[_-]/g, " ");
    const newHeader = normalized.charAt(0).toUpperCase() + normalized.slice(1);
    return (
      <>
        <span className="float-right absolute">{sortIcon}</span>
        <span>{` ${newHeader}`}</span>
      </>
    );
  };

  const getStyle = (header: string, colIndex: number): string => {
    if (!headerStyle) return "";

    // Finds column by name or index if passed via columnFormat
    const column = headerStyle.find(({ index, name }) =>
      name
        ? name.toLowerCase() === header || name.toLowerCase() === "*"
        : index === colIndex
    );

    return column?.style || "";
  };

  const renderTotals = () => (
    <tr className="bg-accent">
      {headers.map((header, index) => (
        <td key={index}>
          {index === 0 && "Totals"}
          {totalsRow && typeof data[0][header] === "number"
            ? data.reduce((sum, row) => sum + Number(row[header]), 0)
            : ""}
        </td>
      ))}
    </tr>
  );

  const handleColumnClick = (header: string) => {
    const newOrder = columnSort.order === Order.ASC ? Order.DESC : Order.ASC;
    setColumnSort({ column: header, order: newOrder });
  };

  const handleFilterChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    if (!Number.isNaN(value)) {
      setTestNameFilter(value);
    }
  };

  return (
    <div className="mt-5 border border-blue-200 rounded-lg p-3">
      {title && (
        <div className="text-center text-primary font-bold text-2xl">
          {title}
        </div>
      )}
      {tableData && (
        <>
          {filter && (
            <div className="mt-5">
              <label htmlFor="test-name">{filter.inputLabel}</label>
              <input
                type="text"
                id="test-name"
                value={testNameFilter}
                onChange={handleFilterChange}
                className="input input-bordered border-secondary focus:border-primary input-sm ml-2 w-96"
              />
              <div className="h-6">
                {testNameFilter.length > 0 && tableData.length === 0 && (
                  <span className="text-sm text-error">
                    No data found! Maybe try changing the filter.
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="mt-2 overflow-y-auto border border-blue-300 rounded-lg max-h-[500px] min-h-[200px]">
            <table className="w-full table-compact">
              <thead className="bg-secondary text-primary h-10 text-left sticky top-0">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      title={header}
                      className={"cursor-pointer " + getStyle(header, index)}
                      onClick={() => handleColumnClick(header)}
                    >
                      {formattedHeader(header)}
                    </th>
                  ))}
                </tr>
                {totalsRow === "above" && renderTotals()}
              </thead>
              <tbody>
                {tableData.map((row: any, rowIndex: number) => (
                  <tr
                    key={`row-${rowIndex}`}
                    className="odd:bg-accent odd:bg-opacity-20 hover:bg-accent hover:bg-opacity-30"
                  >
                    {headers.map((header, index) => (
                      <td key={`row-${rowIndex}-${index}`}>{row[header]}</td>
                    ))}
                  </tr>
                ))}
                {totalsRow === "below" && renderTotals()}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Table;
