import { render, fireEvent, screen } from "@testing-library/react";
import { ColumnHeader } from "../ColumnHeader";
import { TableOrder } from "../Table.props";

describe("ColumnHeader", () => {
  const defaultProps = {
    index: 0,
    header: "name",
    columnSort: { order: TableOrder.ASC, column: "name" },
    setColumnSort: jest.fn(),
  };

  const columnHeader = (
    <table>
      <thead>
        <tr>
          <ColumnHeader {...defaultProps} />
        </tr>
      </thead>
    </table>
  );

  it("renders the header label correctly", () => {
    render(columnHeader);
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("renders the sort icon when the column is sorted", () => {
    render(columnHeader);
    expect(screen.getByTestId("sort-icon")).toBeInTheDocument();
  });

  it("toggles the sort order on click", () => {
    render(columnHeader);
    fireEvent.click(screen.getByText("Name"));
    expect(defaultProps.setColumnSort).toHaveBeenCalledWith({
      order: TableOrder.DESC,
      column: "name",
    });
  });
});
