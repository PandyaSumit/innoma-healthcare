import React from "react";

const ApproachSection: React.FC = () => {
  const approaches = [
    {
      title: "Deep-Seated Trauma",
      description:
        "Advanced clinical processing of deep-seated trauma, underlying complex mental health challenges and persistent issues.",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      accent: "bg-brand-blue",
    },
    {
      title: "Restore Safety and Comfort",
      description:
        "Scientifically-backed Trauma-Oriented Therapy to restore safety, resilience, and sustainable well-being.",
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80",
      featured: true,
      accent: "bg-brand-blue",
    },
    {
      title: "Healing Root Causes",
      description:
        "Specialized therapeutic interventions to address and heal the long-term after-effects of childhood developmental trauma.",
      image:
        "https://images.unsplash.com/photo-1484665754804-74b091211472?w=800&auto=format&fit=crop&q=80",
      icon: (
        <svg
          className="w-5 h-5"
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
      accent: "bg-brand-orange",
    },
    {
      title: "Authentic Self",
      description:
        "Discover and reconnect with your authentic self by nurturing and healing your inner child through guided exploration.",
      image:
        "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&auto=format&fit=crop&q=80",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      accent: "bg-brand-yellow",
    },
  ];

  return (
    <section id="approach" className="bg-white py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12 sm:mb-16 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-1 bg-brand-orange rounded-full" />
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-brand-blue/60">
              Our Approach
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-brand-blue tracking-tight leading-tight mb-5">
            Comprehensive{" "}
            <span className="text-brand-orange">Trauma-Informed Care</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-brand-blue/70 leading-relaxed">
            We combine evidence-based therapy with compassionate care to help
            you navigate your journey towards healing and self discovery
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {approaches.map((item, idx) => (
            <div
              key={idx}
              className={`group flex flex-col overflow-hidden border transition-all duration-400
              rounded-xl sm:rounded-2xl
              ${
                item.featured
                  ? "bg-brand-blue border-brand-blue shadow-[0_18px_45px_rgba(19,32,79,0.28)]"
                  : "bg-white border-slate-200 shadow-[0_10px_28px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.1)]"
              }`}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-t-xl sm:rounded-t-2xl">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div
                  className={`absolute inset-0 bg-gradient-to-t
                  ${
                    item.featured
                      ? "from-brand-blue/90 via-brand-blue/40 to-transparent"
                      : "from-white/90 via-white/60 to-transparent"
                  }`}
                />

                {!item.featured && (
                  <div
                    className={`absolute top-4 left-4 w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-sm ${item.accent}`}
                  >
                    {item.icon}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow">
                <h3
                  className={`text-base sm:text-lg font-semibold leading-snug mb-2 ${
                    item.featured ? "text-white" : "text-slate-900"
                  }`}
                >
                  {item.title}
                </h3>

                <p
                  className={`text-sm leading-relaxed ${
                    item.featured ? "text-blue-100/80" : "text-slate-600"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApproachSection;
