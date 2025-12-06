import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Bar, Pie } from "react-chartjs-2";
import {Chart as ChartJS,BarElement,ArcElement,CategoryScale,LinearScale,Tooltip,Legend,} from "chart.js";

ChartJS.register(BarElement,ArcElement,CategoryScale,LinearScale,Tooltip,Legend);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const resp = await api.get("/check/stats", { signal: controller.signal });
        
        if (resp?.data) setStats(resp.data);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("Failed to load stats:", e);
          setError("Failed to load stats");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      controller.abort();
    };
  }, []); 

  if (loading)
    return (
      <div className="p-6 bg-white rounded shadow-md text-center">Loading…</div>
    );

  if (error)
    return (
      <div className="p-6 bg-white rounded shadow-md text-center text-red-600">
        {error}
      </div>
    );

  if (!stats || !Array.isArray(stats.byCategory) || stats.byCategory.length === 0)
    return (
      <div className="p-6 bg-white rounded shadow-md text-center">
        No aggregated stats available yet.
      </div>
    );

  const labels = stats.byCategory.map((b) => b.category ?? "Unk");
  const counts = stats.byCategory.map((b) => Number(b.count) || 0);

  const colors = ["#7C3AED","#06B6D4","#F97316","#EF4444","#A78BFA","#06B6D4"];

  const barData = {
    labels,
    datasets: [
      {
        label: "Count",
        data: counts,
        backgroundColor: colors.slice(0, labels.length),
      },
    ],
  };

  const pieData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: colors.slice(0, labels.length),
      },
    ],
  };

  const updatedAtText = stats.updatedAt
    ? new Date(stats.updatedAt).toLocaleString()
    : "just now";

  return (
    <div className="p-4 bg-white rounded-lg shadow-md space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <div className="text-sm text-gray-500">Updated: {updatedAtText}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="p-4 rounded-lg bg-gradient-to-br from-white to-blue-50 border"
          aria-label="Total detections"
        >
          <div className="text-sm text-gray-500">Total detections</div>
          <div className="text-3xl font-bold">{Number(stats.count) || 0}</div>
        </div>

        <div className="p-4 rounded-lg bg-white border" aria-label="Average score">
          <div className="text-sm text-gray-500">Average score</div>
          <div className="text-3xl font-bold">
            {typeof stats.avgScore === "number"
              ? stats.avgScore.toFixed(2)
              : stats.avgScore ?? "--"}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border" aria-label="Categories">
          <div className="text-sm text-gray-500">Categories</div>
          <div className="text-lg font-medium mt-1 truncate">{labels.join(", ")}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg bg-white">
          <div className="text-sm text-gray-500 mb-2">Counts by category</div>
          <Bar data={barData} />
        </div>

        <div className="p-4 border rounded-lg bg-white">
          <div className="text-sm text-gray-500 mb-2">Distribution</div>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
}
