import { useEffect, useState } from "react";
import { sortArray } from "../helpers/helpers";

enum Order {
  ASC = "asc",
  DESC = "desc",
}

const SORT_ASC_ICON = "⌃";
const SORT_DESC_ICON = "v";

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
  const [columnSort, setColumnSort] = useState<SortProps>(
    sort || defaultSort()
  );

  const filterData = (filterBy: string) => {
    let sourceData = [...data];

    if (filterBy && filter) {
      // Filter rows based on column value, if <filter> parameter was specified
      sourceData = filter
        ? sourceData.filter((row) =>
            row[filter.column].toLowerCase().includes(filterBy.toLowerCase())
          )
        : sourceData;
    }

    setTableData(sourceData);

    if (getTableData) {
      getTableData(tableData);
    }
  };

  useEffect(() => {
    setHeaders(Object.keys(data[0]));
  }, []);

  useEffect(() => {
    const filterUpdate = setTimeout(() => filterData(testNameFilter), 500);
    return () => clearTimeout(filterUpdate);
  }, [testNameFilter]);

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const getIcon = (order: Order) => {
    switch (order) {
      case Order.ASC:
        return SORT_ASC_ICON;
      case Order.DESC:
        return SORT_DESC_ICON;
    }
  };

  const handleFilterChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    if (!Number.isNaN(value)) {
      setTestNameFilter(value);
    }
  };

  const renderTotals = () => (
    <tr className="bg-blue-100">
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

  const isSortedHeader = (header: string) =>
    columnSort?.column?.toLowerCase() === header?.toLowerCase();

  const formattedHeader = (header: string) => {
    let sortIcon = "";
    if (isSortedHeader(header)) {
      sortIcon = getIcon(columnSort.order);
    }

    const normalized = header.replaceAll(/[_-]/g, " ");
    const newHeader = normalized.charAt(0).toUpperCase() + normalized.slice(1);
    return `${sortIcon} ${newHeader}`;
  };

  const sortData = () => {
    let { column, order } = columnSort;

    // Sort data if <sort> parameter was specified
    const sortedData = sortArray({
      column,
      order,
      array: tableData,
    });

    setTableData(sortedData);
  };

  const handleColumnClick = (header: string) => {
    switch (columnSort?.order) {
      case Order.ASC:
        setColumnSort({ column: header, order: Order.DESC });
        break;
      case Order.DESC:
        setColumnSort({ column: header, order: Order.ASC });
        break;
    }

    sortData();
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

  return (
    <div className="mt-5 border border-blue-200 rounded-lg p-3">
      {title && (
        <div className="text-center text-primary font-bold text-xl">
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
                className="input input-bordered input-sm ml-2 w-96"
              />
            </div>
          )}
          <div className="mt-2 overflow-y-auto border border-blue-300 rounded-lg max-h-[500px]">
            <table className="w-full table-compact">
              <thead className="bg-blue-300 h-10 text-left sticky top-0">
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
                    className="odd:bg-gray-50 hover:bg-blue-50"
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
