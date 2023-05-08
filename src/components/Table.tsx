import { useEffect, useState } from "react";

interface TableProps {
  data: Array<{ [key: string]: any }>;
  totalsRow?: "above" | "below";
  filterRow?: { key: string; label: string };
  getTableData?: Function;
  columnFormat?: [
    {
      name?: string;
      index?: number;
      style: string;
    }
  ];
}

const formatStr = (str: string) => {
  str = str.replaceAll(/[_-]/g, " ");
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const Table = ({
  data,
  totalsRow = "above",
  filterRow,
  getTableData,
  columnFormat,
}: TableProps) => {
  const [testNameFilter, setTestNameFilter] = useState<string>("");
  const [tableData, setTableData] = useState<{ [key: string]: any }>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  const filterData = (filter: string) => {
    // Filter rows based on column (filterIndex) value
    let filteredData = filterRow
      ? data.filter((row) =>
          row[filterRow.key].toLowerCase().includes(filter.toLowerCase())
        )
      : data;

    setTableData(filteredData);

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

  const getColumnStyle = (header: string, colIndex: number): string => {
    if (!columnFormat) return "";
    // Finds column by name or index if passed via columnFormat
    const column = columnFormat.find(({ index, name }) =>
      name ? name.toLowerCase() === header : index === colIndex
    );
    return column?.style || "";
  };

  return (
    <div className="mt-5">
      {tableData && (
        <>
          {filterRow && (
            <div className="mt-5">
              <label htmlFor="test-name">{filterRow.label}</label>
              <input
                type="text"
                id="test-name"
                value={testNameFilter}
                onChange={handleFilterChange}
                className="input input-bordered input-sm ml-2 w-96"
              />
            </div>
          )}
          <div className="mt-2 overflow-hidden rounded-lg border border-blue-300">
            <table className="w-full table-compact">
              <thead className="bg-blue-300 h-10 text-left">
                <tr>
                  {headers.map((header, index) => (
                    <th key={index} className={getColumnStyle(header, index)}>
                      {formatStr(header)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {totalsRow === "above" && renderTotals()}
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
