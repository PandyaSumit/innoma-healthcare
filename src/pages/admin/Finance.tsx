import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchFinanceSummary,
  fetchDailyRevenueChart,
  fetchTherapistRevenue,
} from "../../api/admin.api";
import Spinner from "../../components/ui/Spinner";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatCard from "../../components/admin/AdminStatCard";
import AdminTable from "../../components/admin/AdminTable";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// Simple bar chart using div widths
function SimpleBarChart({
  data,
}: {
  data: { date: string; revenue: number }[];
}) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="space-y-3">
      {data.slice(-14).map((d) => (
        <div key={d.date} className="flex items-center gap-4">
          <span className="text-xs font-bold text-healthcare-text-muted w-20 flex-shrink-0">
            {new Date(d.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
          <div className="flex-1 bg-healthcare-surface rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="h-full bg-brand-blue rounded-full transition-all duration-1000 ease-out shadow-sm"
              style={{ width: `${(d.revenue / max) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-healthcare-text w-20 text-right flex-shrink-0">
            ${d.revenue.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Finance() {
  const [from, setFrom] = useState(daysAgo(29));
  const [to, setTo] = useState(today());

  const summary = useQuery({
    queryKey: ["admin", "finance", "summary"],
    queryFn: fetchFinanceSummary,
  });

  const daily = useQuery({
    queryKey: ["admin", "finance", "daily", from, to],
    queryFn: () => fetchDailyRevenueChart(30),
  });

  const therapists = useQuery({
    queryKey: ["admin", "finance", "therapists"],
    queryFn: () => fetchTherapistRevenue(),
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <AdminPageHeader
        title="Finance"
        description="Track revenue, monitor session value, and analyze therapist performance."
      />

      {summary.isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : summary.data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <AdminStatCard
            label="Total Revenue"
            value={`$${(summary.data.totalRevenue ?? 0).toLocaleString()}`}
            color="bg-blue-50 text-brand-blue"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <AdminStatCard
            label="Total Sessions"
            value={(summary.data.totalSessions ?? 0).toLocaleString()}
            color="bg-emerald-50 text-emerald-600"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
          <AdminStatCard
            label="Avg Session Value"
            value={`$${(summary.data.averageSessionValue ?? 0).toFixed(0)}`}
            color="bg-purple-50 text-purple-600"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
          />
          <AdminStatCard
            label="This Month"
            value={`$${(summary.data.revenueThisMonth ?? 0).toLocaleString()}`}
            color="bg-orange-50 text-brand-orange"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
          />
          <AdminStatCard
            label="Last Month"
            value={`$${(summary.data.revenueLastMonth ?? 0).toLocaleString()}`}
            color="bg-gray-100 text-gray-600"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <AdminStatCard
            label="Revenue Growth"
            value={`${(summary.data.growthPercent ?? 0) > 0 ? "+" : ""}${(summary.data.growthPercent ?? 0).toFixed(1)}%`}
            color={
              (summary.data.growthPercent ?? 0) >= 0
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
            trend={{
              value: Math.abs(summary.data.growthPercent ?? 0).toFixed(1),
              isPositive: (summary.data.growthPercent ?? 0) >= 0,
              label: "Month-over-month",
            }}
          />
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Revenue Chart */}
        <div className="bg-white rounded-3xl border border-healthcare-border shadow-clinical p-8 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:bg-brand-blue/10 transition-colors duration-500" />

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 relative z-10">
            <div>
              <h2 className="text-xl font-bold text-healthcare-text flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-brand-blue"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                </div>
                Daily Revenue
              </h2>
            </div>

            <div className="flex items-center gap-1 bg-healthcare-surface/50 p-1 rounded-xl border border-healthcare-border relative z-10">
              <input
                type="date"
                value={from}
                max={to}
                onChange={(e) => setFrom(e.target.value)}
                className="px-3 py-2 bg-white border border-healthcare-border/60 rounded-lg text-healthcare-text text-[10px] font-bold uppercase outline-none focus:border-brand-blue/50 transition-all cursor-pointer"
              />
              <span className="px-2 text-healthcare-text-muted text-[10px] font-bold uppercase tracking-tight opacity-40">
                to
              </span>
              <input
                type="date"
                value={to}
                min={from}
                max={today()}
                onChange={(e) => setTo(e.target.value)}
                className="px-3 py-2 bg-white border border-healthcare-border/60 rounded-lg text-healthcare-text text-[10px] font-bold uppercase outline-none focus:border-brand-blue/50 transition-all cursor-pointer"
              />
            </div>
          </div>

          <div className="relative z-10">
            {daily.isLoading ? (
              <div className="flex justify-center py-20">
                <Spinner />
              </div>
            ) : daily.data ? (
              <SimpleBarChart data={daily.data} />
            ) : (
              <div className="h-64 flex items-center justify-center text-healthcare-text-muted italic bg-healthcare-surface/30 rounded-2xl border border-dashed border-healthcare-border">
                No revenue data found for this period.
              </div>
            )}
          </div>
        </div>

        {/* Per-Therapist Revenue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-healthcare-text flex items-center gap-2">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Revenue by Therapist
            </h2>
          </div>
          <AdminTable<any>
            data={(therapists.data as any) || []}
            isLoading={therapists.isLoading}
            emptyMessage="No therapist revenue data found."
            columns={[
              {
                header: "Provider",
                accessor: (t) => (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-healthcare-lavender/10 flex items-center justify-center font-bold text-purple-600 text-xs">
                      {t.therapistName[0]}
                    </div>
                    <span className="font-bold text-healthcare-text">
                      {t.therapistName}
                    </span>
                  </div>
                ),
              },
              {
                header: "Sessions",
                accessor: "sessions",
                className: "text-right",
              },
              {
                header: "Revenue",
                accessor: (t) => (
                  <span className="font-bold text-healthcare-text">
                    ${t.revenue.toLocaleString()}
                  </span>
                ),
                className: "text-right",
              },
              {
                header: "Rating",
                accessor: (t) =>
                  t.avgRating != null ? (
                    <div className="flex items-center justify-end gap-1 text-amber-500 font-bold">
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {t.avgRating.toFixed(1)}
                    </div>
                  ) : (
                    "—"
                  ),
                className: "text-right",
                hiddenOnTablet: true,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
