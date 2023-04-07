import { Chart, PieController, ArcElement, Tooltip, Title } from "chart.js";
import { Statuses } from "../types/Tests.type";
import { useEffect, useRef } from "react";

// Register required controllers, elements, and plugins
Chart.register(PieController, ArcElement, Tooltip, Title);

interface PieChartProps {
  statuses: Statuses;
}

const PieChart = ({ statuses }: PieChartProps) => {
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
        labels: ["Passed", "Failed"],
        datasets: [
          {
            data: [statuses.passed, statuses.failed],
            backgroundColor: ["#00cc66", "#ff6666"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Passed vs Failed",
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [statuses]);

  return <canvas className="chart" ref={canvasRef} id="pieChart"></canvas>;
};

export default PieChart;
