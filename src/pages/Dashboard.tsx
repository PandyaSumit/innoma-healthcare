import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { UPCOMING_APPOINTMENTS } from "../data/appointments";

const Dashboard = () => {
  const { user } = useAuth();
  const { getUserAppointments } = useBooking();
  const { upcoming: bookedUpcoming } = getUserAppointments();

  // Combine static appointments with dynamically booked ones
  const allUpcoming = [...UPCOMING_APPOINTMENTS.filter(apt => apt.patientId === 'patient-001'), ...bookedUpcoming];

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (time: string) => {
    // Convert 24h to 12h format if needed
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

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Section */}
      <section className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-healthcare-text tracking-tight">
          Welcome back, {user?.profile?.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-sm sm:text-base text-healthcare-text-muted max-w-2xl">
          Your mental wellness journey continues. Here's what's happening in your care plan.
        </p>
      </section>

      {/* Quick Actions - Booking Flow */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/therapists"
          className="group p-6 bg-gradient-to-br from-brand-blue to-brand-blue/80 rounded-2xl text-white hover:shadow-xl transition-all no-underline hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Find a Therapist</h3>
          <p className="text-sm text-white/80">Browse our network of licensed mental health professionals</p>
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
            Start Now
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>

        <Link
          to="/appointments"
          className="group p-6 bg-white border border-healthcare-border rounded-2xl hover:shadow-lg hover:border-brand-blue/30 transition-all no-underline"
        >
          <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-blue/20 transition-colors">
            <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-healthcare-text mb-2">My Sessions</h3>
          <p className="text-sm text-healthcare-text-muted">View and manage your upcoming appointments</p>
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-blue">
            View All
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>

        <Link
          to="/profile"
          className="group p-6 bg-white border border-healthcare-border rounded-2xl hover:shadow-lg hover:border-brand-blue/30 transition-all no-underline"
        >
          <div className="w-12 h-12 bg-healthcare-lavender/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-healthcare-lavender/50 transition-colors">
            <svg className="w-6 h-6 text-healthcare-lavender" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-healthcare-text mb-2">My Profile</h3>
          <p className="text-sm text-healthcare-text-muted">Update your personal information and preferences</p>
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-healthcare-lavender">
            Edit Profile
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>
      </section>

      {/* Upcoming Sessions */}
      <section className="bg-white rounded-2xl border border-healthcare-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-healthcare-text">Upcoming Sessions</h2>
          <Link
            to="/appointments"
            className="text-sm font-semibold text-brand-blue hover:underline no-underline"
          >
            View All
          </Link>
        </div>

        {allUpcoming.length > 0 ? (
          <div className="space-y-4">
            {allUpcoming.slice(0, 3).map((apt) => {
              const aptDate = new Date(`${apt.date}T${apt.time}`);
              const now = new Date();
              const timeDiff = aptDate.getTime() - now.getTime();
              const minutesDiff = Math.floor(timeDiff / (1000 * 60));
              const canJoin = minutesDiff <= 15 && minutesDiff >= 0;

              return (
                <div
                  key={apt.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-healthcare-surface rounded-xl border border-healthcare-border/50 hover:border-brand-blue/30 transition-all"
                >
                  <img
                    src={apt.therapistPhoto}
                    alt={apt.therapistName}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-healthcare-text truncate">{apt.therapistName}</h3>
                    <p className="text-sm text-healthcare-text-muted">{apt.specialization}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                      <span className="flex items-center gap-1 text-healthcare-text">
                        <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(apt.date)}
                      </span>
                      <span className="text-healthcare-border">|</span>
                      <span className="font-medium text-healthcare-text">{formatTime(apt.time)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    {apt.meetingLink && (
                      <a
                        href={apt.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all no-underline flex items-center gap-2 ${
                          canJoin
                            ? 'bg-green-600 text-white hover:bg-green-700 animate-pulse'
                            : 'bg-brand-blue text-white hover:bg-brand-blue/90'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {canJoin ? 'Join Now' : 'Join Session'}
                      </a>
                    )}
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      apt.type === 'Assessment' ? 'bg-green-100 text-green-700' :
                      apt.type === 'Consultation' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {apt.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-healthcare-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-healthcare-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-healthcare-text mb-2">No upcoming sessions</h3>
            <p className="text-healthcare-text-muted mb-6">Book your first session to start your wellness journey</p>
            <Link
              to="/therapists"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-brand-blue/90 transition-colors no-underline"
            >
              Find a Therapist
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </section>

      {/* Booking Journey Steps */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* How It Works */}
        <div className="bg-white rounded-2xl border border-healthcare-border p-6">
          <h2 className="text-xl font-bold text-healthcare-text mb-6">How Booking Works</h2>
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Find Your Therapist",
                description: "Browse our directory of licensed therapists and find one that matches your needs",
                color: "bg-brand-blue"
              },
              {
                step: 2,
                title: "Book a Session",
                description: "Choose a package and select a date and time that works for you",
                color: "bg-healthcare-lavender"
              },
              {
                step: 3,
                title: "Complete Payment",
                description: "Securely pay for your session using your preferred payment method",
                color: "bg-green-500"
              },
              {
                step: 4,
                title: "Join Your Session",
                description: "Use the meeting link to join your video consultation at the scheduled time",
                color: "bg-indigo-500"
              }
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-healthcare-text mb-1">{item.title}</h3>
                  <p className="text-sm text-healthcare-text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/therapists"
            className="w-full mt-6 py-3 bg-brand-blue text-white rounded-xl font-bold text-sm hover:bg-brand-blue/90 transition-all flex items-center justify-center gap-2 no-underline"
          >
            Start Booking
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Free Assessment Card */}
        <div className="bg-gradient-to-br from-healthcare-lavender/20 to-brand-blue/10 rounded-2xl border border-healthcare-lavender/30 p-6 relative overflow-hidden">
          <div className="absolute -top-14 -right-14 w-40 h-40 bg-brand-blue/5 rounded-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-healthcare-lavender/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="w-14 h-14 bg-brand-blue/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-healthcare-text mb-2">Free Assessment Available</h2>
            <p className="text-sm text-healthcare-text-muted mb-6 max-w-sm">
              Start your journey with a complimentary initial assessment to help us understand your needs and match you with the right therapist.
            </p>

            <div className="rounded-xl border border-brand-blue/20 bg-white/50 p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-healthcare-text">Benefit Active</p>
                  <p className="text-xs text-healthcare-text-muted">Valid for new users</p>
                </div>
              </div>
            </div>

            <Link
              to="/therapists"
              className="w-full py-3 rounded-xl bg-brand-blue text-white text-sm font-bold hover:bg-brand-blue/90 transition flex items-center justify-center gap-2 no-underline"
            >
              Claim Free Assessment
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
