import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchAdminDashboardStats } from "../../api/admin.api";
import Spinner from "../../components/ui/Spinner";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatCard from "../../components/admin/AdminStatCard";

function Icon({ d }: { d: string }) {
  return (
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
        d={d}
      />
    </svg>
  );
}

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: fetchAdminDashboardStats,
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <AdminPageHeader
        title="Dashboard Overview"
        description="Welcome back! Here's what's happening on your platform today."
      />

      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 font-medium flex items-center gap-3">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Failed to load dashboard stats. Please refresh the page or try again
          later.
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdminStatCard
              label="Total Users"
              value={(data.totalUsers ?? 0).toLocaleString()}
              to="/admin/users"
              color="bg-blue-50 text-brand-blue"
              icon={
                <Icon d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              }
            />
            <AdminStatCard
              label="Active Therapists"
              value={data.totalTherapists ?? 0}
              to="/admin/therapists"
              color="bg-purple-50 text-purple-600"
              icon={
                <Icon d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              }
            />
            <AdminStatCard
              label="Total Sessions"
              value={(data.totalSessions ?? 0).toLocaleString()}
              color="bg-emerald-50 text-emerald-600"
              icon={
                <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              }
            />
            <AdminStatCard
              label="Total Revenue"
              value={`$${(data.totalRevenue ?? 0).toLocaleString()}`}
              to="/admin/finance"
              color="bg-orange-50 text-brand-orange"
              icon={
                <Icon d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdminStatCard
              label="New Users (Month)"
              value={data.newUsersThisMonth}
              color="bg-sky-50 text-sky-600"
              icon={
                <Icon d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              }
            />
            <AdminStatCard
              label="Sessions (Month)"
              value={data.sessionsThisMonth}
              color="bg-teal-50 text-teal-600"
              icon={
                <Icon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              }
            />
            <AdminStatCard
              label="Open Tickets"
              value={data.openTickets}
              to="/admin/support"
              color="bg-amber-50 text-amber-600"
              icon={
                <Icon d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              }
            />
            <AdminStatCard
              label="Pending Articles"
              value={data.pendingArticles}
              to="/admin/articles"
              color="bg-rose-50 text-rose-600"
              icon={
                <Icon d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              }
            />
          </div>

          {/* Quick Actions */}
          <section className="bg-white rounded-2xl border border-healthcare-border p-8 shadow-clinical-lg">
            <h2 className="text-xl font-bold text-healthcare-text mb-6 flex items-center gap-2">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                {
                  to: "/admin/therapists/new",
                  label: "Add Therapist",
                  color: "bg-blue-50 text-brand-blue border-blue-100",
                },
                {
                  to: "/admin/articles/new",
                  label: "New Article",
                  color: "bg-purple-50 text-purple-600 border-purple-100",
                },
                {
                  to: "/admin/support",
                  label: "View Tickets",
                  color: "bg-amber-50 text-amber-600 border-amber-100",
                },
                {
                  to: "/admin/faqs",
                  label: "Manage FAQs",
                  color: "bg-emerald-50 text-emerald-600 border-emerald-100",
                },
                {
                  to: "/admin/users",
                  label: "View Users",
                  color: "bg-sky-50 text-sky-600 border-sky-100",
                },
                {
                  to: "/admin/finance",
                  label: "Finance Report",
                  color: "bg-orange-50 text-brand-orange border-orange-100",
                },
              ].map(({ to, label, color }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center justify-center p-4 text-xs font-bold border rounded-2xl hover:scale-[1.02] transition-all no-underline text-center shadow-sm ${color}`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
