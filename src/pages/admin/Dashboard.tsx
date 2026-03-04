import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchAdminDashboardStats } from '../../api/admin.api';
import Spinner from '../../components/ui/Spinner';

function StatCard({
  label,
  value,
  icon,
  color,
  to,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  to?: string;
}) {
  const inner = (
    <div className="bg-white rounded-2xl border border-healthcare-border p-5 shadow-clinical hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-healthcare-text-muted">{label}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-healthcare-text">{value}</p>
    </div>
  );

  return to ? (
    <Link to={to} className="no-underline block">
      {inner}
    </Link>
  ) : (
    inner
  );
}

function Icon({ d }: { d: string }) {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={d} />
    </svg>
  );
}

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: fetchAdminDashboardStats,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-healthcare-text">Admin Dashboard</h1>
        <p className="text-sm text-healthcare-text-muted mt-1">
          Overview of your platform's activity.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
          Failed to load dashboard stats. Please refresh the page.
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Users"
              value={data.totalUsers.toLocaleString()}
              to="/admin/users"
              color="bg-brand-blue/8 text-brand-blue"
              icon={<Icon d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
            />
            <StatCard
              label="Therapists"
              value={data.totalTherapists}
              to="/admin/therapists"
              color="bg-healthcare-lavender/20 text-purple-600"
              icon={<Icon d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />}
            />
            <StatCard
              label="Total Sessions"
              value={data.totalSessions.toLocaleString()}
              color="bg-emerald-50 text-emerald-600"
              icon={<Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
            />
            <StatCard
              label="Total Revenue"
              value={`$${data.totalRevenue.toLocaleString()}`}
              to="/admin/finance"
              color="bg-brand-orange/8 text-brand-orange"
              icon={<Icon d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="New Users (Month)"
              value={data.newUsersThisMonth}
              color="bg-blue-50 text-blue-600"
              icon={<Icon d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />}
            />
            <StatCard
              label="Sessions (Month)"
              value={data.sessionsThisMonth}
              color="bg-emerald-50 text-emerald-600"
              icon={<Icon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />}
            />
            <StatCard
              label="Open Tickets"
              value={data.openTickets}
              to="/admin/support"
              color="bg-yellow-50 text-yellow-600"
              icon={<Icon d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
            />
            <StatCard
              label="Pending Articles"
              value={data.pendingArticles}
              to="/admin/articles"
              color="bg-purple-50 text-purple-600"
              icon={<Icon d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />}
            />
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl border border-healthcare-border p-6 shadow-clinical">
            <h2 className="text-base font-bold text-healthcare-text mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { to: '/admin/therapists/new', label: 'Add Therapist' },
                { to: '/admin/articles/new', label: 'New Article' },
                { to: '/admin/support', label: 'View Tickets' },
                { to: '/admin/faqs', label: 'Manage FAQs' },
                { to: '/admin/users', label: 'View Users' },
                { to: '/admin/finance', label: 'Finance Report' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center justify-center px-3 py-3 text-xs font-bold text-brand-blue bg-brand-blue/5 border border-brand-blue/15 rounded-xl hover:bg-brand-blue/10 transition-all no-underline text-center"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
