import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: Record<string, number>;
}

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f97316",
  "#a855f7",
  "#e11d48",
];

export default function PieDistributionChart({ data }: Props) {
  const formatted = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={formatted}
          dataKey="value"
          nameKey="name"
          outerRadius={90}
          innerRadius={40}
        >
          {formatted.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}