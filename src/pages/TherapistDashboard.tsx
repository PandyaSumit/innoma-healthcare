import { Link } from "react-router-dom";
import { UPCOMING_APPOINTMENTS } from "../data/appointments";
import { useAuth } from "../context/AuthContext";

const TherapistDashboard = () => {
  const { user } = useAuth();

  const stats = {
    totalPatients: 450,
    sessionsThisWeek: 12,
    upcomingToday: 3,
    avgRating: 4.8,
  };

  const upcomingPatients = UPCOMING_APPOINTMENTS.slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-healthcare-text">
          Welcome back, {user?.profile?.name}
        </h1>
        <p className="text-sm text-healthcare-text-muted">
          Here’s an overview of your practice today
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          {
            label: "Total patients",
            value: stats.totalPatients,
            note: "↑ 12 this month",
            color: "text-brand-blue",
            icon: (
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M12 12a4 4 0 100-8 4 4 0 000 8z"
                />
              </svg>
            ),
          },
          {
            label: "Sessions this week",
            value: stats.sessionsThisWeek,
            note: "Mon – Sun",
            color: "text-indigo-600",
            icon: (
              <svg
                className="w-7 h-7"
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
            ),
          },
          {
            label: "Upcoming today",
            value: stats.upcomingToday,
            note: "Next at 2:00 PM",
            color: "text-green-600",
            icon: (
              <svg
                className="w-7 h-7"
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
            ),
          },
          {
            label: "Average rating",
            value: stats.avgRating,
            note: "From 156 reviews",
            color: "text-yellow-500",
            icon: (
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ),
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-[12px] border border-healthcare-border p-6 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-healthcare-text-muted">
                {stat.label}
              </span>
              <span className={stat.color}>{stat.icon}</span>
            </div>

            <p className="text-3xl font-semibold text-healthcare-text">
              {stat.value}
            </p>
            <p className="text-xs text-healthcare-text-muted mt-2">
              {stat.note}
            </p>
          </div>
        ))}
      </div>

      {/* Today Schedule */}
      <div className="bg-white rounded-[12px] border border-healthcare-border p-6">
        <h2 className="text-lg font-semibold text-healthcare-text mb-6">
          Today’s schedule
        </h2>

        <div className="space-y-4">
          {upcomingPatients.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center justify-between p-4 rounded-[10px] bg-healthcare-surface hover:shadow-sm transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-brand-blue text-white flex items-center justify-center font-semibold">
                  {apt.therapistName[0]}
                </div>

                <div>
                  <p className="font-medium text-healthcare-text">
                    Anonymous Patient #{apt.id.split("-")[1]}
                  </p>
                  <p className="text-sm text-healthcare-text-muted">
                    {apt.type} · {apt.specialization}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-healthcare-text">{apt.time}</p>
                <p className="text-sm text-healthcare-text-muted">
                  {apt.duration} min
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/settings"
          className="p-6 rounded-[12px] bg-brand-blue text-white hover:opacity-90 transition text-left no-underline block cursor-pointer"
        >
          <h3 className="text-lg font-semibold mb-1">Manage availability</h3>
          <p className="text-sm text-white/80">
            Update your calendar and time slots
          </p>
        </Link>

        <Link
          to="/appointments?tab=patients"
          className="p-6 rounded-[12px] border border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition text-left no-underline block cursor-pointer"
        >
          <h3 className="text-lg font-semibold mb-1">Patient records</h3>
          <p className="text-sm opacity-80">View and update session notes</p>
        </Link>

        <button className="p-6 rounded-[12px] border border-healthcare-border hover:bg-healthcare-surface transition text-left">
          <h3 className="text-lg font-semibold mb-1 text-healthcare-text">
            Analytics
          </h3>
          <p className="text-sm text-healthcare-text-muted">
            Practice performance insights
          </p>
        </button>
      </div>
    </div>
  );
};

export default TherapistDashboard;
