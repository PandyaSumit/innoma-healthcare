import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  data: { date: string; value: number }[];
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
            className="bg-gray-200 rounded-t-md"
            style={{
              width: "6%",
              height: `${30 + Math.random() * 70}%`,
            }}
          />
        ))}
      </div>

      {/* fake X axis labels */}
      <div className="flex justify-between mt-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-3 w-8 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}

export default function BarTrendChart({ data, isLoading }: Props) {
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
      style={{ marginLeft: "-20px" }}
      width="100%"
      height="100%"
    >
      <BarChart data={formatted}>
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

        <Bar dataKey="value" fill="#1e40af" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
