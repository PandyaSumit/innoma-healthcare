import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import { THERAPISTS } from '../data/therapists';

const Dashboard = () => {
  const { user } = useAuth();
  const { upcomingAppointments, pastAppointments, getTotalSessions, getTotalHours, getNextAppointment } = useAppointments();

  const userName = user?.profile?.name || 'there';
  const firstName = userName.split(' ')[0];
  const nextAppointment = getNextAppointment();
  const totalSessions = getTotalSessions();
  const totalHours = getTotalHours();

  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Format time for display
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  // Get recent therapists from past appointments
  const recentTherapists = [...new Set(pastAppointments.map(apt => apt.therapistId))]
    .slice(0, 3)
    .map(id => THERAPISTS.find(t => t.id === id))
    .filter(Boolean);

  // Calculate care progress (simplified)
  const careProgress = totalSessions > 0 ? Math.min(Math.round((totalSessions / 10) * 100), 100) : 0;

  return (
    <div className="animate-fade-in space-y-6 md:space-y-8 pb-20 md:pb-0">
      {/* Welcome Header */}
      <section className="mb-6 md:mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-healthcare-text tracking-tight mb-1">
              {getGreeting()}, {firstName}
            </h1>
            <p className="text-healthcare-text-muted">
              {nextAppointment
                ? `Your next session is ${formatDate(nextAppointment.date)} at ${formatTime(nextAppointment.time)}`
                : 'Welcome to your wellness dashboard. Ready to book your first session?'}
            </p>
          </div>
          <Link
            to="/assessment"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-bold text-sm hover:bg-brand-blue/90 transition-all shadow-md no-underline whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Book Session
          </Link>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-clinical border border-healthcare-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-bold text-healthcare-text-muted uppercase tracking-wider mb-1">Care Progress</p>
          <p className="text-2xl font-bold text-brand-blue">{careProgress}%</p>
          <div className="mt-2 w-full h-1.5 bg-healthcare-surface rounded-full overflow-hidden">
            <div className="h-full bg-brand-blue rounded-full transition-all" style={{ width: `${careProgress}%` }} />
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-clinical border border-healthcare-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-bold text-healthcare-text-muted uppercase tracking-wider mb-1">Total Sessions</p>
          <p className="text-2xl font-bold text-healthcare-text">{totalSessions}</p>
          <p className="text-xs text-healthcare-text-muted mt-1">{totalHours} hours completed</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-clinical border border-healthcare-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-bold text-healthcare-text-muted uppercase tracking-wider mb-1">Upcoming</p>
          <p className="text-2xl font-bold text-healthcare-text">{upcomingAppointments.length}</p>
          <p className="text-xs text-healthcare-text-muted mt-1">sessions scheduled</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-clinical border border-healthcare-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-healthcare-lavender/10 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-healthcare-lavender" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-bold text-healthcare-text-muted uppercase tracking-wider mb-1">Wellness Score</p>
          <p className="text-2xl font-bold text-healthcare-text">Good</p>
          <p className="text-xs text-healthcare-text-muted mt-1">Keep it up!</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - Upcoming Sessions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Session Card */}
          {nextAppointment && (
            <div className="bg-gradient-to-br from-brand-blue to-brand-blue/90 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                    Next Session
                  </span>
                  {new Date(nextAppointment.date + 'T' + nextAppointment.time) <= new Date(Date.now() + 15 * 60 * 1000) && (
                    <span className="px-3 py-1 bg-green-400/20 text-green-200 rounded-full text-xs font-semibold animate-pulse">
                      Starting Soon
                    </span>
                  )}
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                  <img
                    src={nextAppointment.therapistPhoto}
                    alt={nextAppointment.therapistName}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-white/20"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{nextAppointment.therapistName}</h3>
                    <p className="text-white/80 text-sm mb-2">{nextAppointment.specialization}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(nextAppointment.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(nextAppointment.time)}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Video Call
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/join/${nextAppointment.id}`}
                    className="px-6 py-3 bg-white text-brand-blue rounded-xl font-bold hover:bg-white/90 transition-all no-underline whitespace-nowrap"
                  >
                    Join Session
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Sessions List */}
          <div className="bg-white p-6 rounded-2xl shadow-clinical border border-healthcare-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-healthcare-text">Upcoming Sessions</h3>
              <Link to="/appointments" className="text-sm font-medium text-brand-blue hover:underline no-underline">
                View All
              </Link>
            </div>

            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 3).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-4 p-4 bg-healthcare-surface rounded-xl hover:bg-healthcare-surface/80 transition-colors"
                  >
                    <img
                      src={apt.therapistPhoto}
                      alt={apt.therapistName}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-healthcare-text truncate">{apt.therapistName}</p>
                      <p className="text-sm text-healthcare-text-muted">
                        {formatDate(apt.date)} • {formatTime(apt.time)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      apt.type === 'Assessment' ? 'bg-green-100 text-green-700' :
                      apt.type === 'Follow-up' ? 'bg-blue-100 text-blue-700' :
                      'bg-brand-orange/10 text-brand-orange'
                    }`}>
                      {apt.type}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-healthcare-surface rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-healthcare-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-healthcare-text-muted mb-4">No upcoming sessions</p>
                <Link
                  to="/assessment"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium no-underline"
                >
                  Book Your First Session
                </Link>
              </div>
            )}
          </div>

          {/* Recent Therapists */}
          {recentTherapists.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-clinical border border-healthcare-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-healthcare-text">Your Therapists</h3>
                <Link to="/therapists" className="text-sm font-medium text-brand-blue hover:underline no-underline">
                  Browse All
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recentTherapists.map((therapist) => therapist && (
                  <Link
                    key={therapist.id}
                    to={`/therapists/${therapist.id}`}
                    className="flex flex-col items-center p-4 bg-healthcare-surface rounded-xl hover:bg-brand-blue/5 transition-colors no-underline group"
                  >
                    <img
                      src={therapist.photo}
                      alt={therapist.name}
                      className="w-16 h-16 rounded-full object-cover mb-3 group-hover:ring-2 ring-brand-blue transition-all"
                    />
                    <p className="font-semibold text-healthcare-text text-sm text-center">{therapist.name}</p>
                    <p className="text-xs text-healthcare-text-muted">{therapist.specializations[0]}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-medium text-healthcare-text">{therapist.rating}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl shadow-clinical border border-healthcare-border">
            <h3 className="text-lg font-bold text-healthcare-text mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/assessment"
                className="flex items-center gap-3 p-4 bg-brand-blue/5 rounded-xl hover:bg-brand-blue/10 transition-colors no-underline group"
              >
                <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-healthcare-text group-hover:text-brand-blue transition-colors">Book Assessment</p>
                  <p className="text-xs text-healthcare-text-muted">Free 30-min session</p>
                </div>
                <svg className="w-5 h-5 text-healthcare-text-muted group-hover:text-brand-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                to="/therapists"
                className="flex items-center gap-3 p-4 bg-healthcare-surface rounded-xl hover:bg-healthcare-surface/80 transition-colors no-underline group"
              >
                <div className="w-10 h-10 bg-healthcare-lavender/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-healthcare-lavender" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-healthcare-text">Find Therapists</p>
                  <p className="text-xs text-healthcare-text-muted">Browse specialists</p>
                </div>
                <svg className="w-5 h-5 text-healthcare-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                to="/support"
                className="flex items-center gap-3 p-4 bg-healthcare-surface rounded-xl hover:bg-healthcare-surface/80 transition-colors no-underline group"
              >
                <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-healthcare-text">Get Support</p>
                  <p className="text-xs text-healthcare-text-muted">Help & FAQs</p>
                </div>
                <svg className="w-5 h-5 text-healthcare-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Free Assessment Promo */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-200/30 rounded-full -mr-12 -mt-12" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-green-800 mb-2">Free Assessment Available</h4>
              <p className="text-sm text-green-700 mb-4">Book a complimentary 30-minute session to discuss your mental wellness goals.</p>
              <Link
                to="/assessment"
                className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800 no-underline"
              >
                Claim Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Wellness Tips */}
          <div className="bg-white p-6 rounded-2xl shadow-clinical border border-healthcare-border">
            <h3 className="text-lg font-bold text-healthcare-text mb-4">Daily Wellness Tip</h3>
            <div className="p-4 bg-healthcare-lavender/5 rounded-xl border border-healthcare-lavender/10">
              <p className="text-sm text-healthcare-text italic">
                "Take 5 minutes today to practice deep breathing. Inhale for 4 counts, hold for 4, exhale for 6. This simple exercise can reduce stress and improve focus."
              </p>
              <p className="text-xs text-healthcare-text-muted mt-3">— Innoma Wellness Team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
