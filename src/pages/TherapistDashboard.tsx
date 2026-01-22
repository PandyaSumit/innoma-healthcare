import { UPCOMING_APPOINTMENTS } from '../data/appointments';
import { useAuth } from '../context/AuthContext';

const TherapistDashboard = () => {
  const { user } = useAuth();

  // Mock therapist stats
  const stats = {
    totalPatients: 450,
    sessionsThisWeek: 12,
    upcomingToday: 3,
    avgRating: 4.8,
  };

  const upcomingPatients = UPCOMING_APPOINTMENTS.slice(0, 3);

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-healthcare-text mb-2">Welcome back, {user?.profile?.name}!</h1>
        <p className="text-healthcare-text-muted">Here's your practice overview for today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-healthcare-border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-healthcare-text-muted">Total Patients</span>
            <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold text-healthcare-text">{stats.totalPatients}</p>
          <p className="text-xs text-green-600 mt-2">↑ 12 this month</p>
        </div>

        <div className="bg-white rounded-lg border border-healthcare-border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-healthcare-text-muted">Sessions This Week</span>
            <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold text-healthcare-text">{stats.sessionsThisWeek}</p>
          <p className="text-xs text-healthcare-text-muted mt-2">Mon - Sun</p>
        </div>

        <div className="bg-white rounded-lg border border-healthcare-border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-healthcare-text-muted">Upcoming Today</span>
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold text-healthcare-text">{stats.upcomingToday}</p>
          <p className="text-xs text-healthcare-text-muted mt-2">Next at 2:00 PM</p>
        </div>

        <div className="bg-white rounded-lg border border-healthcare-border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-healthcare-text-muted">Average Rating</span>
            <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-healthcare-text">{stats.avgRating}</p>
          <p className="text-xs text-healthcare-text-muted mt-2">From 156 reviews</p>
        </div>
      </div>

      {/* Upcoming Patients */}
      <div className="bg-white rounded-lg border border-healthcare-border p-6 mb-8">
        <h2 className="text-xl font-bold text-healthcare-text mb-6">Today's Schedule</h2>
        <div className="space-y-4">
          {upcomingPatients.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center justify-between p-4 bg-healthcare-surface rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold">
                  {apt.therapistName.split(' ')[0][0]}
                </div>
                <div>
                  <p className="font-bold text-healthcare-text">Anonymous Patient #{apt.id.split('-')[1]}</p>
                  <p className="text-sm text-healthcare-text-muted">
                    {apt.type} • {apt.specialization}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-healthcare-text">{apt.time}</p>
                <p className="text-sm text-healthcare-text-muted">{apt.duration} min</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="p-6 bg-brand-blue text-white rounded-lg font-bold hover:bg-healthcare-text transition-colors text-left">
          <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg mb-1">Manage Availability</h3>
          <p className="text-sm text-white/80">Update your calendar and time slots</p>
        </button>

        <button className="p-6 bg-white border-2 border-brand-blue text-brand-blue rounded-lg font-bold hover:bg-brand-blue hover:text-white transition-colors text-left">
          <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg mb-1">Patient Records</h3>
          <p className="text-sm text-healthcare-text-muted">View and update session notes</p>
        </button>

        <button className="p-6 bg-white border-2 border-healthcare-border text-healthcare-text rounded-lg font-bold hover:bg-healthcare-surface transition-colors text-left">
          <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="text-lg mb-1">Analytics</h3>
          <p className="text-sm text-healthcare-text-muted">View your practice insights</p>
        </button>
      </div>
    </div>
  );
};

export default TherapistDashboard;
