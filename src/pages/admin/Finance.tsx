import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchFinanceSummary,
  fetchDailyRevenue,
  fetchTherapistRevenue,
} from '../../api/admin.api';
import Spinner from '../../components/ui/Spinner';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function SummaryCard({
  label,
  value,
  sub,
  positive,
}: {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-healthcare-border p-5 shadow-clinical">
      <p className="text-xs font-bold text-healthcare-text-muted uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-bold text-healthcare-text">{value}</p>
      {sub && (
        <p className={`text-xs font-semibold mt-1 ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

// Simple bar chart using div widths
function SimpleBarChart({ data }: { data: { date: string; revenue: number }[] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="space-y-1.5">
      {data.slice(-14).map((d) => (
        <div key={d.date} className="flex items-center gap-3">
          <span className="text-xs text-healthcare-text-muted w-20 flex-shrink-0">{d.date.slice(5)}</span>
          <div className="flex-1 bg-healthcare-surface rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-brand-blue rounded-full transition-all"
              style={{ width: `${(d.revenue / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold text-healthcare-text w-16 text-right flex-shrink-0">
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
    queryKey: ['admin', 'finance', 'summary'],
    queryFn: fetchFinanceSummary,
  });

  const daily = useQuery({
    queryKey: ['admin', 'finance', 'daily', from, to],
    queryFn: () => fetchDailyRevenue({ from, to }),
  });

  const therapists = useQuery({
    queryKey: ['admin', 'finance', 'therapists'],
    queryFn: fetchTherapistRevenue,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-healthcare-text">Finance</h1>
        <p className="text-sm text-healthcare-text-muted mt-1">Revenue overview and session analytics.</p>
      </div>

      {summary.isLoading ? (
        <div className="flex justify-center py-6"><Spinner size="lg" /></div>
      ) : summary.data ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <SummaryCard label="Total Revenue" value={`$${summary.data.totalRevenue.toLocaleString()}`} />
          <SummaryCard label="Total Sessions" value={summary.data.totalSessions.toLocaleString()} />
          <SummaryCard label="Avg Session Value" value={`$${summary.data.averageSessionValue.toFixed(0)}`} />
          <SummaryCard label="This Month" value={`$${summary.data.revenueThisMonth.toLocaleString()}`} />
          <SummaryCard label="Last Month" value={`$${summary.data.revenueLastMonth.toLocaleString()}`} />
          <SummaryCard
            label="Growth"
            value={`${summary.data.growthPercent > 0 ? '+' : ''}${summary.data.growthPercent.toFixed(1)}%`}
            sub={summary.data.growthPercent >= 0 ? 'Month-over-month' : 'Month-over-month'}
            positive={summary.data.growthPercent >= 0}
          />
        </div>
      ) : null}

      {/* Daily Revenue Chart */}
      <div className="bg-white rounded-2xl border border-healthcare-border shadow-clinical p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2 className="text-base font-bold text-healthcare-text">Daily Revenue</h2>
          <div className="flex items-center gap-2 text-sm">
            <input
              type="date"
              value={from}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
              className="px-3 py-1.5 border border-healthcare-neutral/20 rounded-lg text-healthcare-text text-sm outline-none focus:border-brand-blue"
            />
            <span className="text-healthcare-text-muted">to</span>
            <input
              type="date"
              value={to}
              min={from}
              max={today()}
              onChange={(e) => setTo(e.target.value)}
              className="px-3 py-1.5 border border-healthcare-neutral/20 rounded-lg text-healthcare-text text-sm outline-none focus:border-brand-blue"
            />
          </div>
        </div>
        {daily.isLoading ? (
          <div className="flex justify-center py-6"><Spinner /></div>
        ) : daily.data ? (
          <SimpleBarChart data={daily.data} />
        ) : null}
      </div>

      {/* Per-Therapist Revenue */}
      <div className="bg-white rounded-2xl border border-healthcare-border shadow-clinical overflow-hidden">
        <div className="px-6 py-4 border-b border-healthcare-border">
          <h2 className="text-base font-bold text-healthcare-text">Revenue by Therapist</h2>
        </div>
        {therapists.isLoading ? (
          <div className="flex justify-center py-6"><Spinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-healthcare-border bg-healthcare-surface/40">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider">Therapist</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider">Sessions</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider">Revenue</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider hidden md:table-cell">Avg Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-healthcare-border">
                {(therapists.data ?? []).map((t) => (
                  <tr key={t.therapistId} className="hover:bg-healthcare-surface/20 transition-colors">
                    <td className="px-5 py-4 font-bold text-healthcare-text">{t.therapistName}</td>
                    <td className="px-5 py-4 text-right text-healthcare-text">{t.sessions}</td>
                    <td className="px-5 py-4 text-right font-bold text-healthcare-text">${t.revenue.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right text-healthcare-text hidden md:table-cell">
                      {t.avgRating != null ? t.avgRating.toFixed(1) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
