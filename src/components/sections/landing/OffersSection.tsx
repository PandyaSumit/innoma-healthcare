import React from "react";

const OffersSection: React.FC = () => {
  const offers = [
    {
      title: "Mental illness",
      description:
        "Your diagnosis does not define you. Identify the root of your issues and move on to a healthier and happier life.",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M12 21a9 9 0 100-18 9 9 0 000 18z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 10a3 3 0 106 0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Trauma Care",
      description:
        "Let us unpack the baggage you’ve been carrying alone for so long. We help you make sense of your experience and rebuild safety.",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Burnout Recovery",
      description:
        "Burnout isn’t a sign of weakness; it’s a sign that you’ve been strong for too long. You don’t need to hold your breath.",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M13 10V3L4 14h7v7l9-11h-7z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Root Cause Care",
      description:
        "We enhance mental well-being by simultaneously working on symptoms and root trauma for lasting change.",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="what-we-offer" className="py-14 sm:py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
        {/* ================= HEADER ================= */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-1 bg-brand-orange rounded-full" />
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-brand-blue-900/60">
              What we offer
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-brand-blue tracking-tight leading-tight mb-4">
            Specialised care for <br className="hidden sm:block" />
            <span className="text-brand-orange">your unique journey</span>
          </h2>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 flex flex-col items-start"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center mb-6 text-brand-blue group-hover:bg-brand-blue-50 transition-colors duration-200">
                {offer.icon}
              </div>

              <h3 className="text-lg font-bold mb-3 text-brand-blue tracking-tight">
                {offer.title}
              </h3>

              <p className="text-brand-blue-900/60 leading-relaxed text-sm">
                {offer.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
