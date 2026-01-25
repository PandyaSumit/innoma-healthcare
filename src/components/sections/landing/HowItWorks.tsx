import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Sign up in minutes with a simple, secure registration process. Your privacy is our priority.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      number: '02',
      title: 'Book Free Assessment',
      description: 'Tell us about your concerns and get matched with the perfect therapist for a complimentary 30-minute session.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'from-brand-orange to-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      number: '03',
      title: 'Meet Your Therapist',
      description: 'Connect via secure video consultation from the comfort of your home. Flexible scheduling that fits your life.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-healthcare-lavender to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      number: '04',
      title: 'Begin Your Journey',
      description: 'Continue with personalized sessions, track your progress, and build lasting mental wellness habits.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <section className="section-spacing bg-white">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-brand-blue/10 text-brand-blue text-sm font-semibold rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-healthcare-text mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-lg text-healthcare-text-muted">
            Your path to better mental health starts here. Four simple steps to connect with professional support.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Connector Line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-healthcare-border to-transparent" />
              )}

              <div className="bg-white rounded-2xl p-6 border border-healthcare-border hover:border-brand-blue/20 hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden group-hover:-translate-y-1">
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 ${step.bgColor} opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative z-10">
                  {/* Step Number */}
                  <div className="flex items-center justify-between mb-6">
                    <span className={`text-5xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent opacity-20 group-hover:opacity-40 transition-opacity`}>
                      {step.number}
                    </span>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg`}>
                      {step.icon}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-healthcare-text mb-3">
                    {step.title}
                  </h3>
                  <p className="text-healthcare-text-muted text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white font-bold rounded-full hover:bg-brand-blue/90 transition-all shadow-lg shadow-brand-blue/20 no-underline"
          >
            Get Started Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
