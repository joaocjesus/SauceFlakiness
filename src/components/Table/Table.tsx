import { useEffect, useState } from "react";
import { sortArray } from "helpers/helpers";
import { ColumnHeader } from "components";
import { TableOrder, SortProps, TableProps, KeyArray } from "./Table.props";

const Table = ({
  data,
  title,
  sort,
  totalsRow = "above",
  filter,
  getTableData,
  headerStyle,
}: TableProps) => {
  const defaultSort = {
    column: Object.keys(data[0])[0],
    order: TableOrder.ASC,
  };

  const [testNameFilter, setTestNameFilter] = useState<string>("");
  const [tableData, setTableData] = useState<KeyArray>([...data]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnSort, setColumnSort] = useState<SortProps>(sort || defaultSort);

  useEffect(() => {
    setHeaders(Object.keys(data[0]));
  }, []);

  useEffect(() => {
    const sortedData = sortData(tableData);
    setTableData(sortedData || tableData);
  }, [columnSort]);

  useEffect(() => {
    const filterUpdate = setTimeout(() => filterData(), 500);
    return () => clearTimeout(filterUpdate);
  }, [testNameFilter]);

  useEffect(() => {
    if (getTableData) {
      getTableData(tableData);
    }
  }, [tableData]);

  const filterData = () => {
    const sourceData = [...data];

    // Filter rows based on column value, if <filter> parameter was specified
    const filtered = filter
      ? sourceData.filter((row) =>
          row[filter.column]
            .toLowerCase()
            .includes(testNameFilter.toLowerCase())
        )
      : sourceData;

    setTableData(filtered);
  };

  const sortData = (sourceData: KeyArray) => {
    if (!sourceData || sourceData.length === 0) return;

    let { column, order } = columnSort;

    // Sort data if <sort> parameter was specified
    const sortedData = sortArray({
      column,
      order,
      array: sourceData,
    });

    return sortedData;
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

  const handleFilterChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    if (!Number.isNaN(value)) {
      setTestNameFilter(value);
    }
  };

  const clearFilter = () => {
    setTestNameFilter("");
  };

  return (
    <div className="mt-5 border border-accent rounded-lg p-3">
      {title && (
        <div className="text-center text-primary font-bold text-2xl">
          {title}
        </div>
      )}
      {tableData && (
        <>
          {filter && (
            <div className="mt-5">
              <label htmlFor="filter-input">{filter.inputLabel}</label>
              <input
                type="text"
                id="filter-input"
                data-testid="filter-input"
                value={testNameFilter}
                onChange={handleFilterChange}
                className="input input-bordered border-secondary focus:border-primary focus:outline-1 hover:border-primary input-sm ml-2 w-96"
              />
              <button
                className="btn-sm btn-secondary text-primary hover:text-white hover:bg-red-800 rounded-md ml-2"
                title="Clear filter"
                onClick={clearFilter}
              >
                X
              </button>
              <div className="h-6">
                {tableData.length > 0 && (
                  <span className="text-sm text-primary">
                    Showing {tableData.length} results.
                  </span>
                )}
                {testNameFilter.length > 0 && tableData.length === 0 && (
                  <span className="text-sm text-error">
                    No data found! Maybe try changing the filter.
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="mt-2 overflow-y-auto border border-blue-300 rounded-lg max-h-[500px]">
            <table className="w-full table-compact">
              <thead className="bg-secondary text-primary h-10 text-left sticky top-0">
                <tr>
                  {headers.map((header, index) => (
                    <ColumnHeader
                      key={index}
                      header={header}
                      index={index}
                      columnSort={columnSort}
                      setColumnSort={setColumnSort}
                      headerStyle={headerStyle}
                    />
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

export { Table };
