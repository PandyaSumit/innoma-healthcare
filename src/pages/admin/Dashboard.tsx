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
          <section className="bg-white rounded-2xl border border-healthcare-border p-8 shadow-clinical hover:shadow-clinical-lg transition-all duration-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

            <h2 className="text-xl font-bold text-healthcare-text mb-8 flex items-center gap-3 relative z-10">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
              {[
                {
                  to: "/admin/therapists/new",
                  label: "Add Therapist",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  ),
                  color: "bg-blue-50 text-brand-blue border-blue-100/50",
                },
                {
                  to: "/admin/articles/new",
                  label: "New Article",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  ),
                  color: "bg-purple-50 text-purple-600 border-purple-100/50",
                },
                {
                  to: "/admin/support",
                  label: "View Tickets",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  ),
                  color: "bg-amber-50 text-amber-600 border-amber-100/50",
                },
                {
                  to: "/admin/faqs",
                  label: "Manage FAQs",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  ),
                  color: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
                },
                {
                  to: "/admin/users",
                  label: "View Users",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  ),
                  color: "bg-sky-50 text-sky-600 border-sky-100/50",
                },
                {
                  to: "/admin/finance",
                  label: "Finance",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  ),
                  color: "bg-orange-50 text-brand-orange border-orange-100/50",
                },
              ].map(({ to, label, color, icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`group/btn flex flex-col items-center justify-center p-5 gap-3 border rounded-2xl hover:bg-white hover:shadow-clinical transition-all duration-300 no-underline text-center ${color}`}
                >
                  <svg
                    className="w-6 h-6 group-hover/btn:scale-110 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {icon}
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
