import { render, fireEvent, screen, act } from "@testing-library/react";
import { Table, TableOrder } from "components";

describe("Table", () => {
  const testData = [
    { name: "John", age: 30, country: "USA" },
    { name: "Alice", age: 25, country: "Canada" },
    { name: "Bob", age: 40, country: "UK" },
  ];

  const defaultProps = {
    data: testData,
    title: "Test Table",
    sort: { column: "name", order: TableOrder.ASC },
    filter: {
      column: "name",
      inputLabel: "Name",
    },
    getTableData: jest.fn(),
    headerStyle: [{ index: 0, style: "bg-red-500", name: "Name" }],
  };

  it("renders the title correctly", () => {
    render(<Table {...defaultProps} />);
    expect(screen.getByText("Test Table")).toBeInTheDocument();
  });

  it("renders the filter input correctly", () => {
    render(<Table {...defaultProps} />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("applies custom headerStyle", () => {
    render(<Table {...defaultProps} />);
    expect(screen.getByTestId("column-header-0")).toHaveClass("bg-red-500");
  });

  it("filters data based on the input value", async () => {
    jest.useFakeTimers();

    render(<Table {...defaultProps} />);
    fireEvent.change(screen.getByTestId("filter-input"), {
      target: { value: "John" },
    });

    // Advance timers by 500ms to account for the delay of updating the filter
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(defaultProps.getTableData).toHaveBeenCalledTimes(1);
    expect(defaultProps.getTableData).toHaveBeenCalledWith([
      { name: "John", age: 30, country: "USA" },
    ]);

    jest.useRealTimers();
  });

  it("clears the filter input", () => {
    render(<Table {...defaultProps} />);
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John" },
    });
    fireEvent.click(screen.getByTitle("Clear filter"));
    expect(screen.getByLabelText("Name")).toHaveValue("");
  });

  it("renders the table rows correctly", () => {
    render(<Table {...defaultProps} />);
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("USA")).toBeInTheDocument();
  });
});
