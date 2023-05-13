import { render, screen, fireEvent } from "@testing-library/react";
import { TestCase } from "types/Tests.type";
import { FlakinessTrend } from "components";

const sampleData: TestCase[] = [
  {
    name: "Test 1",
    statuses: {
      passed: 80,
      failed: 15,
      error: 5,
      complete: 100,
    },
    total_runs: 100,
    error_rate: 5,
    fail_rate: 15,
    pass_rate: 80,
    avg_duration: 200,
    median_duration: 180,
    total_duration: 20000,
  },
  {
    name: "Test 2",
    statuses: {
      passed: 70,
      failed: 8,
      error: 2,
      complete: 80,
    },
    total_runs: 80,
    error_rate: 2.5,
    fail_rate: 10,
    pass_rate: 87.5,
    avg_duration: 150,
    median_duration: 140,
    total_duration: 12000,
  },
];

describe("FlakinessTrend", () => {
  test("renders the component correctly", () => {
    render(<FlakinessTrend data={sampleData} />);
    console.log("FlakinessTrend", screen.debug());
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("renders the title passed as a prop", () => {
    render(<FlakinessTrend data={sampleData} title="Test Flakiness Trend" />);
    expect(screen.getByText("Test Flakiness Trend")).toBeInTheDocument();
  });

  test("renders the chart with provided data", () => {
    render(<FlakinessTrend data={sampleData} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  test("toggles the display between aggregate and per test", () => {
    render(<FlakinessTrend data={sampleData} />);
    const toggleButton = screen.getByRole("button");

    expect(screen.getByText("per test")).toBeInTheDocument();
    fireEvent.click(toggleButton);
    expect(screen.getByText("aggregate")).toBeInTheDocument();
    fireEvent.click(toggleButton);
    expect(screen.getByText("per test")).toBeInTheDocument();
  });
});
