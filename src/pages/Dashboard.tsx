const Dashboard = () => {
  const stats = [
    // { label: 'Care Progress', value: '24%', detail: 'Step 2 of 5 completing' },
    { label: 'Next Session', value: 'Jan 24', detail: '10:30 AM with Dr. Aris' },
    { label: 'Assessments', value: '1 Pending', detail: 'Clinical intake form' }
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Welcome Header */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-healthcare-text tracking-tight mb-2">Welcome back, Sumit</h1>
        <p className="text-healthcare-text-muted">Your healing journey is progressing well. Here is what's new today.</p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-clinical border border-healthcare-border">
            <p className="text-xs font-bold text-healthcare-text-muted uppercase tracking-wider mb-2">{stat.label}</p>
            <p className="text-2xl font-bold text-brand-blue mb-1">{stat.value}</p>
            <p className="text-sm text-healthcare-text tracking-tight opacity-70">{stat.detail}</p>
          </div>
        ))}
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-white p-8 rounded-2xl shadow-clinical border border-healthcare-border">
          <h3 className="text-xl font-bold text-healthcare-text mb-6">Upcoming Care Path</h3>
          <div className="space-y-6">
            {[
              { title: 'Need Assessment', time: 'Completed', type: 'Intake' },
              { title: 'Therapist Matching', time: 'In Progress', type: 'Assignment' },
              { title: 'First Therapy Session', time: 'Scheduled', type: 'Consultation' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-green-400' : i === 1 ? 'bg-brand-blue animate-pulse' : 'bg-healthcare-border'}`} />
                <div className="flex-grow">
                  <p className="text-sm font-bold text-healthcare-text">{item.title}</p>
                  <p className="text-xs text-healthcare-text-muted">{item.type}</p>
                </div>
                <p className="text-xs font-semibold text-healthcare-text-muted">{item.time}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-brand-blue/5 text-brand-blue rounded-lg font-bold text-sm hover:bg-brand-blue hover:text-white transition-all border-none cursor-pointer">
            View Full Journey
          </button>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-clinical border border-brand-blue/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -mr-16 -mt-16" />
          <h3 className="text-xl font-bold text-healthcare-text mb-2">Free Eligibility Status</h3>
          <p className="text-sm text-healthcare-text-muted mb-6">Your introductory assessment eligibility is now active.</p>
          <div className="p-4 bg-brand-blue/5 rounded-xl border border-brand-blue/10 mb-8">
            <p className="text-sm font-bold text-brand-blue mb-1">Benefit Activated</p>
            <p className="text-xs text-brand-blue opacity-80">Valid until Feb 21, 2026</p>
          </div>
          <button className="w-full py-3 bg-brand-blue text-white rounded-lg font-bold text-sm hover:opacity-90 transition-all shadow-md border-none cursor-pointer">
            Claim Your Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
