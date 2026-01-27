import { Link } from "react-router-dom";
import { UPCOMING_APPOINTMENTS, MOCK_PATIENTS } from "../data/appointments";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";

const TherapistDashboard = () => {
  const { user } = useAuth();
  const { bookedAppointments } = useBooking();

  // Combine static upcoming appointments with dynamically booked ones
  const allUpcoming = [
    ...UPCOMING_APPOINTMENTS,
    ...bookedAppointments.filter((apt) => apt.status === "Upcoming"),
  ];

  // Filter for today's sessions
  const today = new Date().toISOString().split("T")[0];
  const todaySessions = allUpcoming.filter((apt) => apt.date === today);

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
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${period}`;
    }
    return time;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div>
      <div className="space-y-8">
        {/* ================= HEADER ================= */}
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-healthcare-text">
            Welcome back, {user?.profile?.name}
          </h1>
          <p className="text-sm text-healthcare-text-muted mt-1">
            Overview of your practice today
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              label: "Patients",
              value: stats.totalPatients,
              note: `${bookedAppointments.length} new`,
              color: "text-brand-blue",
            },
            {
              label: "This week",
              value: stats.sessionsThisWeek,
              note: "Sessions",
              color: "text-indigo-600",
            },
            {
              label: "Today",
              value: stats.upcomingToday,
              note:
                todaySessions.length > 0
                  ? `Next ${formatTime(todaySessions[0]?.time)}`
                  : "No sessions",
              color: "text-green-600",
            },
            {
              label: "Rating",
              value: stats.avgRating,
              note: "156 reviews",
              color: "text-yellow-500",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white border border-healthcare-border rounded-xl p-4 sm:p-6"
            >
              <p className="text-xs text-healthcare-text-muted mb-1">
                {stat.label}
              </p>
              <p className="text-2xl sm:text-3xl font-semibold text-healthcare-text">
                {stat.value}
              </p>
              <p className="text-xs text-healthcare-text-muted mt-1">
                {stat.note}
              </p>
            </div>
          ))}
        </div>

        {/* ================= UPCOMING ================= */}
        <div className="bg-white border border-healthcare-border rounded-xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base sm:text-lg font-semibold text-healthcare-text">
              Upcoming sessions
            </h2>
            <Link
              to="/appointments"
              className="text-sm font-medium text-brand-blue no-underline"
            >
              View all
            </Link>
          </div>

          {allUpcoming.length > 0 ? (
            <div className="space-y-3">
              {allUpcoming.slice(0, 5).map((apt) => {
                const aptDate = new Date(`${apt.date}T${apt.time}`);
                const now = new Date();
                const diff = (aptDate.getTime() - now.getTime()) / 60000;
                const canJoin = diff <= 15 && diff >= -60;

                return (
                  <div
                    key={apt.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-healthcare-surface border border-healthcare-border"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          apt.patientPhoto ||
                          `https://ui-avatars.com/api/?name=${apt.patientName}`
                        }
                        className="w-11 h-11 rounded-full object-cover"
                      />

                      <div>
                        <p className="text-sm font-medium text-healthcare-text">
                          {apt.patientName || "Patient"}
                        </p>
                        <p className="text-xs text-healthcare-text-muted">
                          {apt.type} · {apt.specialization}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <p className="text-xs text-healthcare-text-muted">
                          {formatDate(apt.date)}
                        </p>
                        <p className="text-sm font-semibold text-healthcare-text">
                          {formatTime(apt.time)}
                        </p>
                      </div>

                      {apt.meetingLink && (
                        <a
                          href={apt.meetingLink}
                          target="_blank"
                          className={`px-4 py-2 rounded-lg text-sm font-semibold no-underline ${
                            canJoin
                              ? "bg-green-600 text-white"
                              : "bg-brand-blue text-white"
                          }`}
                        >
                          Join
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-healthcare-text-muted">
              No upcoming sessions today
            </div>
          )}
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link
            to="/settings"
            className="bg-brand-blue text-white rounded-xl p-5 no-underline"
          >
            <h3 className="font-semibold mb-1">Manage availability</h3>
            <p className="text-sm text-white/80">Update your working hours</p>
          </Link>

          <Link
            to="/appointments?tab=patients"
            className="border border-brand-blue text-brand-blue rounded-xl p-5 no-underline"
          >
            <h3 className="font-semibold mb-1">Patient records</h3>
            <p className="text-sm opacity-80">View notes & history</p>
          </Link>

          <Link
            to="/appointments"
            className="border border-healthcare-border rounded-xl p-5 no-underline"
          >
            <h3 className="font-semibold mb-1 text-healthcare-text">
              Session history
            </h3>
            <p className="text-sm text-healthcare-text-muted">
              Past consultations
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboard;
