import React from "react";
import "./Table.css";

interface TableProps {
  data: Array<{ [key: string]: any }>;
  totalsRow?: "above" | "below";
}

const formatStr = (str: string) => {
  str = str.replaceAll(/[_-]/g, " ");
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const Table: React.FC<TableProps> = ({ data, totalsRow = "above" }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const headers = Object.keys(data[0]);

  const renderHeader = () => (
    <tr>
      {headers.map((header, index) => (
        <th key={index}>{formatStr(header)}</th>
      ))}
    </tr>
  );

  const renderBody = () =>
    data.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {headers.map((header, index) => (
          <td key={index}>{row[header]}</td>
        ))}
      </tr>
    ));

  const renderTotals = () => (
    <tr className="totals">
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
    <table className="Table">
      <tbody>
        {renderHeader()}
        {totalsRow === "above" && renderTotals()}
        {renderBody()}
        {totalsRow === "below" && renderTotals()}
      </tbody>
    </table>
  );
};

export default Table;