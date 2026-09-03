import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { fetchMedicines } from "../../services/medicine.service";

export default function StockChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["medicines"],
    queryFn: fetchMedicines,
  });

  if (isLoading) return <div className="empty-state">Loading stock data...</div>;
  if (!data || data.length === 0)
    return <div className="empty-state">No medicine stock available yet.</div>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -18, bottom: 14 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#475569" }}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 11, fill: "#475569" }} />
          <Tooltip formatter={(value: number) => [`${value} units`, "Stock"]} />
          <Bar dataKey="quantity" fill="#2563eb" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
