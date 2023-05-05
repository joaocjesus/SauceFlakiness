import React, { useEffect, useState } from "react";

interface TableProps {
  data: Array<{ [key: string]: any }>;
  totalsRow?: "above" | "below";
  maxRows?: number;
}

const formatStr = (str: string) => {
  str = str.replaceAll(/[_-]/g, " ");
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const Table: React.FC<TableProps> = ({ data, totalsRow = "above" }) => {
  const [rowsInput, setRowsInput] = useState<number>(50);
  const [testNameFilter, setTestNameFilter] = useState<string>("");
  const [tableData, setTableData] = useState<{ [key: string]: any }>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  useEffect(() => {
    filterData();
  }, []);

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const filterData = () => {
    let filteredData = [...data];
    if (filteredData) {
      filteredData = filteredData.slice(0, rowsInput);
      setTableData(filteredData);
      setHeaders(Object.keys(filteredData[0]));
    }
    return data;
  };

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
            ? data.reduce((sum, row) => sum + row[header], 0)
            : ""}
        </td>
      ))}
    </tr>
  );

  return (
    <div className="mt-5">
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
      <div className="mt-2 text-xs text-blue-800">
        Showing {rowsInput} of {data.length} rows
      </div>
      <label htmlFor="test-name" className="mt-2">
        Filter by test name:
      </label>
      <input
        type="text"
        id="test-name"
        value={testNameFilter}
        onChange={handleFilterChange}
        className="input input-bordered input-sm ml-2 w-96"
      />
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
