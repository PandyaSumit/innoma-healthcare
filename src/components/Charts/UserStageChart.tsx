import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#f59e0b", "#22c55e"];

export function UserStageChart({ data }) {
  const formatted = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={formatted} dataKey="value" nameKey="name" outerRadius={90}>
          {formatted.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}