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
    column: data ? Object.keys(data[0])[0] : "",
    order: TableOrder.ASC,
  };
  const [tableFilter, setTableFilter] = useState<string>("");
  const [tableData, setTableData] = useState<KeyArray>(data || []);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnSort, setColumnSort] = useState<SortProps>(sort || defaultSort);

  useEffect(() => {
    if (data) {
      setHeaders(Object.keys(data[0]));
      setTableData([...data]);
    }
  }, [data]);

  useEffect(() => {
    const sortedData = sortData(tableData);
    if (sortedData) {
      setTableData(sortedData);
    }
  }, [columnSort]);

  useEffect(() => {
    const filterUpdate = setTimeout(() => filterData(), 500);
    return () => clearTimeout(filterUpdate);
  }, [tableFilter]);

  const filterData = () => {
    if (!data || !filter) return;
    // Filter rows based on column value, if <filter> parameter was specified
    const filtered = data.filter((row) =>
      row[filter.column].toLowerCase().includes(tableFilter.toLowerCase())
    );

    setTableData(filtered);
    if (getTableData) getTableData(filtered);
  };

  const sortData = (sourceData: KeyArray) => {
    if (!sourceData || sourceData.length === 0 || !columnSort) return;

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
      {totalsRow &&
        tableData.length > 0 &&
        Object.keys(tableData[0]).map((header, index) => (
          <td key={index}>
            {index === 0 && "Totals"}
            {typeof tableData[0][header] === "number"
              ? tableData.reduce((sum, row) => sum + Number(row[header]), 0)
              : ""}
          </td>
        ))}
      {totalsRow && tableData?.length === 0 && (
        <td colSpan={headers.length} className="text-sm">
          No records to display!
        </td>
      )}
    </tr>
  );

  const handleFilterChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    if (!Number.isNaN(value)) {
      setTableFilter(value);
    }
  };

  const clearFilter = () => {
    setTableFilter("");
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
                value={tableFilter}
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
                {tableFilter && tableData.length === 0 && (
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
                  {headers &&
                    headers.map((header, index) => (
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
