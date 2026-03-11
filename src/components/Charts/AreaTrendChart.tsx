import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  data: { date: string; value: number }[];
  color: string;
  isLoading?: boolean;
}

/* ---------------- SKELETON ---------------- */

function ChartSkeleton() {
  return (
    <div className="w-full h-full flex flex-col justify-end p-4 animate-pulse">
      <div className="flex items-end justify-between h-full gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded"
            style={{
              width: "6%",
              height: `${30 + Math.random() * 70}%`,
            }}
          />
        ))}
      </div>

      {/* X Axis labels */}
      <div className="flex justify-between mt-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-3 w-8 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}

export default function AreaTrendChart({ data, color, isLoading }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  }));

  if (isLoading) {
    return <ChartSkeleton />;
  }

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      style={{ marginLeft: "-20px" }}
    >
      <AreaChart width={"100%"} data={formatted}>
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />

        <XAxis dataKey="label" />

        <YAxis />

        <Tooltip
          contentStyle={{
            background: "#fff",
            boxShadow: "0px 0px 1px gray",
            borderRadius: "8px",
            color: "#000",
          }}
        />

        <Area
          type="monotone"
          dataKey="value"
          strokeWidth={3}
          fill="url(#gradient)"
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
