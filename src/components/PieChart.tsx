import { Chart, PieController, ArcElement, Tooltip, Title } from "chart.js";
import { TestStatuses } from "types/Tests.type";
import { useEffect, useRef } from "react";

// Register required controllers, elements, and plugins
Chart.register(PieController, ArcElement, Tooltip, Title);

interface PieChartProps {
  statuses: TestStatuses;
  title?: string;
  classes?: string;
  width?: number;
  height?: number;
}

const PieChart = ({
  statuses,
  title,
  classes,
  width,
  height,
}: PieChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const context = canvasRef.current.getContext("2d");

    if (!context) {
      return;
    }

    const chart = new Chart(context, {
      type: "pie",
      data: {
        labels: ["Passed", "Failed", "Complete", "Error"],
        datasets: [
          {
            data: [
              statuses.passed,
              statuses.failed,
              statuses.complete,
              statuses.error,
            ],
            backgroundColor: ["#00cc66", "#ff7c7c", "#616161", "#ff0000"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title,
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [statuses]);

  return (
    <div className={classes}>
      <canvas className="chart" ref={canvasRef} id="pieChart"></canvas>
    </div>
  );
};

export { PieChart };
