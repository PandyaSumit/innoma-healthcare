import { Link } from 'react-router-dom';

const FreeAssessmentCTA = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue to-healthcare-lavender" />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />

      <div className="container-wide relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">Limited Time Offer</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Start Your Journey with a{' '}
            <span className="text-brand-yellow">Free Assessment</span>
          </h2>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Take the first step towards better mental health. Book a complimentary 30-minute session with a qualified therapist — no commitment required.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10">
            {[
              { icon: '🎯', text: 'Personalized matching' },
              { icon: '🔒', text: '100% confidential' },
              { icon: '💳', text: 'No payment required' },
              { icon: '📅', text: 'Flexible scheduling' },
            ].map((benefit) => (
              <div key={benefit.text} className="flex items-center gap-2 text-white/90">
                <span className="text-xl">{benefit.icon}</span>
                <span className="text-sm font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-blue font-bold rounded-full hover:bg-brand-yellow hover:text-brand-blue transition-all shadow-xl no-underline text-lg"
            >
              Book Free Assessment
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/therapists"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-bold rounded-full border-2 border-white/30 hover:bg-white/10 hover:border-white/50 transition-all no-underline text-lg"
            >
              Browse Therapists
            </Link>
          </div>

          {/* Trust Indicator */}
          <p className="mt-8 text-white/60 text-sm">
            Join 10,000+ people who've started their mental wellness journey with us
          </p>
        </div>
      </div>
    </section>
  );
};

export default FreeAssessmentCTA;
