import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Data = {
  date: string;
  revenue: number;
};

export default function RevenueChart({ data }: { data: Data[] }) {
  const chartData = data.slice(-14).map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1e40af" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#1e40af" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />

          <XAxis dataKey="label" stroke="#1e40af" tick={{ fontSize: 12 }} />

          <YAxis stroke="#1e40af" />

          <Tooltip
            contentStyle={{
              background: "#fff",
              boxShadow: "0px 0px 1px gray",
              borderRadius: "8px",
              color: "#000",

            }}
            formatter={(value: number | any) => [
              `$${value.toLocaleString()}`,
              "Revenue",
            ]}
          />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#1e40af"
            strokeWidth={3}
            fill="url(#revenueGradient)"
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
