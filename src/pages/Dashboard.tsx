import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { UPCOMING_APPOINTMENTS } from "../data/appointments";

const Dashboard = () => {
  const { user } = useAuth();
  const { getUserAppointments } = useBooking();
  const { upcoming: bookedUpcoming } = getUserAppointments();

  // Combine static appointments with dynamically booked ones
  const allUpcoming = [
    ...UPCOMING_APPOINTMENTS.filter((apt) => apt.patientId === "patient-001"),
    ...bookedUpcoming,
  ];

  const nextSession = allUpcoming.length > 0 ? allUpcoming[0] : null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

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

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section>
        <h1 className="text-2xl sm:text-3xl font-semibold text-healthcare-text tracking-tight">
          Welcome back, {user?.profile?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-sm text-healthcare-text-muted mt-1">
          Your mental wellness journey continues. Here's what's happening.
        </p>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-healthcare-border p-5">
          <p className="text-sm text-healthcare-text-muted mb-1">
            Next session
          </p>
          <p className="text-lg font-semibold text-healthcare-text">
            {nextSession
              ? `${formatDate(nextSession.date)}, ${formatTime(nextSession.time)}`
              : "None scheduled"}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-healthcare-border p-5">
          <p className="text-sm text-healthcare-text-muted mb-1">
            Upcoming sessions
          </p>
          <p className="text-lg font-semibold text-healthcare-text">
            {allUpcoming.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-healthcare-border p-5">
          <p className="text-sm text-healthcare-text-muted mb-1">Assessment</p>
          <p className="text-lg font-semibold text-green-600">1 pending</p>
        </div>
      </section>

      {/* Upcoming Sessions */}
      <section className="bg-white rounded-xl border border-healthcare-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-healthcare-text">
            Upcoming Sessions
          </h2>
          <Link
            to="/appointments"
            className="text-sm font-medium text-brand-blue no-underline hover:underline"
          >
            View all
          </Link>
        </div>

        {allUpcoming.length > 0 ? (
          <div className="space-y-3">
            {allUpcoming.slice(0, 3).map((apt) => (
              <div
                key={apt.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-healthcare-surface rounded-lg border border-healthcare-border/50"
              >
                <img
                  src={apt.therapistPhoto}
                  alt={apt.therapistName}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-healthcare-text text-sm truncate">
                    {apt.therapistName}
                  </h3>
                  <p className="text-xs text-healthcare-text-muted">
                    {apt.specialization} &middot; {formatDate(apt.date)}{" "}
                    &middot; {formatTime(apt.time)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {apt.meetingLink ? (
                    <a
                      href={apt.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-brand-blue text-white text-xs font-semibold rounded-lg no-underline flex items-center gap-1.5 hover:opacity-90"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Join Session
                    </a>
                  ) : (
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-lg">
                      {apt.type}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-healthcare-text-muted mb-4">
              No upcoming sessions. Book your first session to get started.
            </p>
            <Link
              to="/find-therapist"
              className="inline-block px-5 py-2.5 bg-brand-blue text-white rounded-lg text-sm font-semibold no-underline hover:opacity-90"
            >
              Find a Therapist
            </Link>
          </div>
        )}
      </section>

      {/* Care Journey + Assessment */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Care Journey */}
        <div className="bg-white rounded-xl border border-healthcare-border p-6">
          <h2 className="text-lg font-semibold text-healthcare-text mb-5">
            Your care journey
          </h2>
          <div className="space-y-5">
            {[
              { label: "Initial assessment", done: true },
              { label: "Therapist matching", done: allUpcoming.length > 0 },
              { label: "First session", done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step.done
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.done ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-sm ${
                    step.done
                      ? "text-healthcare-text font-medium"
                      : "text-healthcare-text-muted"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/appointments"
            className="mt-5 block text-sm font-medium text-brand-blue no-underline hover:underline"
          >
            View full journey
          </Link>
        </div>

        {/* Free Assessment */}
        <div className="bg-white rounded-xl border border-healthcare-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-healthcare-text">
                Free assessment
              </h2>
              <p className="text-xs text-healthcare-text-muted">
                Eligible for new users
              </p>
            </div>
          </div>
          <p className="text-sm text-healthcare-text-muted mb-5">
            Get a complimentary initial assessment to help us understand your
            needs and match you with the right therapist.
          </p>
          <Link
            to="/find-therapist"
            className="block w-full text-center px-5 py-2.5 bg-brand-blue text-white rounded-lg text-sm font-semibold no-underline hover:opacity-90"
          >
            Claim assessment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
