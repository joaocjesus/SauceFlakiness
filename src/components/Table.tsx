import React, { useEffect, useState } from "react";
import Tests from "../helpers/Tests";

interface TableProps {
  source: Tests;
  dataToRender: Array<{ [key: string]: any }>;
  totalsRow?: "above" | "below";
  filterRow?: { key: string; label: string };
  limitRows?: number;
  rowsLimitInput?: boolean;
  getTable?: Function;
}

const formatStr = (str: string) => {
  str = str.replaceAll(/[_-]/g, " ");
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const Table: React.FC<TableProps> = ({
  source,
  dataToRender,
  totalsRow = "above",
  filterRow,
  limitRows,
  rowsLimitInput = true,
  getTable,
}) => {
  const [rowsInput, setRowsInput] = useState<number>(50);
  const [testNameFilter, setTestNameFilter] = useState<string>("");
  const [tableData, setTableData] = useState<{ [key: string]: any }>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const data = dataToRender;

  const filterData = () => {
    // Filter rows based on column (filterIndex) value
    let filteredData =
      testNameFilter.length > 0 && filterRow
        ? data.filter((row) =>
            row[filterRow.key]
              .toLowerCase()
              .includes(testNameFilter.toLowerCase())
          )
        : [...data];

    if (limitRows) {
      // Sets amount of rows based on rowsInput
      filteredData = filteredData.slice(0, rowsInput);
    }
    setTableData(filteredData);

    if (getTable) {
      const tests = { ...source.data(), test_cases: filteredData };
      getTable(tests);
    }
    Logger.error(filteredData);

    if (filteredData.length > 0 && filteredData[0]) {
      setHeaders(Object.keys(filteredData[0]));
    } else {
      setHeaders([]);
    }
    return data;
  };

  useEffect(() => {
    filterData();
  }, [testNameFilter]);

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const handleRowsChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    if (!Number.isNaN(value)) {
      setRowsInput(value);
    }
  };

  const handleFilterChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    if (!Number.isNaN(value)) {
      setTestNameFilter(value);
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    filterData();
  };

  const renderHeader = () => (
    <thead className="bg-blue-300 h-10 text-left">
      <tr>
        {headers.map((header, index) => (
          <th key={index}>{formatStr(header)}</th>
        ))}
      </tr>
    </thead>
  );

  const renderBody = () =>
    tableData.map((row: any, rowIndex: number) => (
      <tr key={rowIndex} className="odd:bg-gray-50 hover:bg-blue-50">
        {headers.map((header, index) => (
          <td key={index}>{row[header]}</td>
        ))}
      </tr>
    ));

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

  return (
    <div className="mt-5">
      {rowsLimitInput && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="quantity" className="mr-2">
            Items to display:
          </label>
          <input
            type="number"
            id="quantity"
            value={rowsInput}
            onChange={handleRowsChange}
            className="input input-bordered input-sm"
          />
          <button type="submit" className="btn btn-sm ml-2">
            Save
          </button>
        </form>
      )}
      <div className="mt-2 text-xs text-blue-800">
        Showing {rowsInput} of {data.length} rows
      </div>
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
          {renderHeader()}
          <tbody>
            {totalsRow === "above" && renderTotals()}
            {renderBody()}
            {totalsRow === "below" && renderTotals()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
