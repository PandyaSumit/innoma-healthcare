import { Link } from "react-router-dom";
import { UPCOMING_APPOINTMENTS, MOCK_PATIENTS } from "../data/appointments";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";

const TherapistDashboard = () => {
  const { user } = useAuth();
  const { bookedAppointments } = useBooking();

  // Combine static upcoming appointments with dynamically booked ones
  const allUpcoming = [...UPCOMING_APPOINTMENTS, ...bookedAppointments.filter(apt => apt.status === 'Upcoming')];

  // Filter for today's sessions
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = allUpcoming.filter(apt => apt.date === today);

  const stats = {
    totalPatients: MOCK_PATIENTS.length + bookedAppointments.length,
    sessionsThisWeek: allUpcoming.length,
    upcomingToday: todaySessions.length,
    avgRating: 4.8,
  };

  // Format time for display
  const formatTime = (time: string) => {
    const match = time.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = match[2];
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${period}`;
    }
    return time;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-healthcare-text">
          Welcome back, {user?.profile?.name}
        </h1>
        <p className="text-sm text-healthcare-text-muted">
          Here's an overview of your practice today
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          {
            label: "Total patients",
            value: stats.totalPatients,
            note: `${bookedAppointments.length} new bookings`,
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
            note: todaySessions.length > 0 ? `Next at ${formatTime(todaySessions[0]?.time)}` : "No sessions today",
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

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-[12px] border border-healthcare-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-healthcare-text">
            Upcoming Sessions
          </h2>
          <Link
            to="/appointments"
            className="text-sm font-semibold text-brand-blue hover:underline no-underline"
          >
            View All
          </Link>
        </div>

        {allUpcoming.length > 0 ? (
          <div className="space-y-4">
            {allUpcoming.slice(0, 5).map((apt) => {
              const aptDate = new Date(`${apt.date}T${apt.time}`);
              const now = new Date();
              const timeDiff = aptDate.getTime() - now.getTime();
              const minutesDiff = Math.floor(timeDiff / (1000 * 60));
              const canJoin = minutesDiff <= 15 && minutesDiff >= -60;

              return (
                <div
                  key={apt.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-[10px] bg-healthcare-surface hover:shadow-sm transition border border-transparent hover:border-brand-blue/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={apt.patientPhoto || `https://ui-avatars.com/api/?name=${apt.patientName}&background=random`}
                        alt={apt.patientName || 'Patient'}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                      />
                      {apt.status === 'Upcoming' && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    <div>
                      <p className="font-medium text-healthcare-text">
                        {apt.patientName || 'Patient'}
                      </p>
                      <p className="text-sm text-healthcare-text-muted">
                        {apt.type} · {apt.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-healthcare-text-muted">{formatDate(apt.date)}</p>
                      <p className="font-semibold text-healthcare-text">{formatTime(apt.time)}</p>
                    </div>

                    {apt.meetingLink && (
                      <a
                        href={apt.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all no-underline flex items-center gap-2 ${
                          canJoin
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-brand-blue text-white hover:bg-brand-blue/90'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {canJoin ? 'Join Now' : 'Join'}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-healthcare-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-healthcare-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-healthcare-text mb-2">No upcoming sessions</h3>
            <p className="text-healthcare-text-muted">Your schedule is clear for now</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/settings"
          className="p-6 rounded-[12px] bg-brand-blue text-white hover:opacity-90 transition text-left no-underline block cursor-pointer"
        >
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-1">Manage availability</h3>
          <p className="text-sm text-white/80">
            Update your calendar and time slots
          </p>
        </Link>

        <Link
          to="/appointments?tab=patients"
          className="p-6 rounded-[12px] border border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition text-left no-underline block cursor-pointer"
        >
          <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M12 12a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-1">Patient records</h3>
          <p className="text-sm opacity-80">View and update session notes</p>
        </Link>

        <Link
          to="/appointments"
          className="p-6 rounded-[12px] border border-healthcare-border hover:bg-healthcare-surface transition text-left no-underline block"
        >
          <div className="w-10 h-10 bg-healthcare-surface rounded-lg flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-healthcare-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-1 text-healthcare-text">
            Session History
          </h3>
          <p className="text-sm text-healthcare-text-muted">
            View past sessions and notes
          </p>
        </Link>
      </div>

      {/* Meeting Links Info */}
      <div className="bg-gradient-to-r from-green-50 to-brand-blue/5 rounded-2xl border border-green-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-healthcare-text mb-2">Video Sessions</h3>
            <p className="text-sm text-healthcare-text-muted mb-4">
              Each booked session includes a unique meeting link. You can join sessions 15 minutes before the scheduled time.
              Meeting links are automatically generated when patients complete their booking.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2 text-green-700 font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Secure video calls
              </span>
              <span className="flex items-center gap-2 text-green-700 font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                HIPAA compliant
              </span>
              <span className="flex items-center gap-2 text-green-700 font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                50 min sessions
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboard;
