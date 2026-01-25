import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = [
    {
      label: "Next session",
      value: "Jan 24",
      detail: "10:30 AM · Dr. Aris",
    },
    {
      label: "Assessments",
      value: "1 pending",
      detail: "Clinical intake form",
    },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Welcome */}
      <section className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-healthcare-text tracking-tight">
          Welcome back, Priya
        </h1>
        <p className="text-sm sm:text-base text-healthcare-text-muted max-w-2xl">
          Your healing journey is progressing steadily. Here’s what’s coming up
          next in your care plan.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="
              bg-white
              rounded-[12px]
              border border-healthcare-border
              p-6
              hover:shadow-sm
              transition
            "
          >
            <p className="text-xs font-semibold text-healthcare-text-muted uppercase tracking-wide mb-2">
              {stat.label}
            </p>

            <p className="text-2xl font-semibold text-brand-blue mb-1">
              {stat.value}
            </p>

            <p className="text-sm text-healthcare-text-muted">{stat.detail}</p>
          </div>
        ))}
      </section>

      {/* Main Sections */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Care Path */}
        <div
          className="
            bg-white
            rounded-[16px]
            border border-healthcare-border
            p-8
          "
        >
          <h3 className="text-lg font-semibold text-healthcare-text mb-6">
            Your care journey
          </h3>

          <div className="space-y-6">
            {[
              {
                title: "Initial assessment",
                status: "Completed",
                active: false,
              },
              {
                title: "Therapist matching",
                status: "In progress",
                active: true,
              },
              {
                title: "First therapy session",
                status: "Scheduled",
                active: false,
              },
            ].map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className={`
                    w-3 h-3 rounded-full
                    ${
                      step.active
                        ? "bg-brand-blue animate-pulse"
                        : step.status === "Completed"
                          ? "bg-green-500"
                          : "bg-healthcare-border"
                    }
                  `}
                />

                <div className="flex-1">
                  <p className="text-sm font-semibold text-healthcare-text">
                    {step.title}
                  </p>
                  <p className="text-xs text-healthcare-text-muted">
                    {step.status}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/appointments"
            className="w-full mt-8 py-3 bg-brand-blue/5 text-brand-blue rounded-lg font-bold text-sm hover:bg-brand-blue hover:text-white transition-all border-none cursor-pointer block text-center no-underline"
          >
            View Full Journey
          </Link>
        </div>

        {/* Eligibility */}
        <div
          className="
            bg-white
            rounded-[16px]
            border border-brand-blue/10
            p-8
            relative
            overflow-hidden
          "
        >
          <div className="absolute -top-14 -right-14 w-40 h-40 bg-brand-blue/5 rounded-full" />

          <h3 className="text-lg font-semibold text-healthcare-text mb-2">
            Free assessment eligibility
          </h3>

          <p className="text-sm text-healthcare-text-muted mb-6 max-w-sm">
            Your introductory assessment is currently available and ready to be
            scheduled.
          </p>

          <div className="rounded-[12px] border border-brand-blue/10 bg-brand-blue/5 p-4 mb-8">
            <p className="text-sm font-semibold text-brand-blue mb-1">
              Benefit active
            </p>
            <p className="text-xs text-brand-blue/80">
              Valid until Feb 21, 2026
            </p>
          </div>

          <button
            className="
              w-full py-3
              rounded-[10px]
              bg-brand-blue
              text-white
              text-sm font-semibold
              hover:opacity-90
              transition
            "
          >
            Claim assessment
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
