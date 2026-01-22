import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-healthcare-surface">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-healthcare-text mb-4">About Innoma Healthcare</h1>
          <p className="text-xl text-healthcare-text-muted max-w-3xl mx-auto">
            Democratizing access to quality mental health services through secure, accessible digital consultations
          </p>
        </div>

        <div className="space-y-12">
          {/* Mission */}
          <section className="bg-white rounded-lg border border-healthcare-border p-8">
            <h2 className="text-3xl font-bold text-healthcare-text mb-4">Our Mission</h2>
            <p className="text-lg text-healthcare-text-muted leading-relaxed">
              To provide a trusted ecosystem where individuals can find the right therapist, book assessments, and
              receive consultations—all from the comfort of their homes—while ensuring complete data security and
              compliance.
            </p>
          </section>

          {/* Problem We're Solving */}
          <section className="bg-white rounded-lg border border-healthcare-border p-8">
            <h2 className="text-3xl font-bold text-healthcare-text mb-6">The Problem We're Solving</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-healthcare-surface rounded-lg">
                <h3 className="font-bold text-healthcare-text mb-2">Limited Access</h3>
                <p className="text-healthcare-text-muted">
                  Only 1 therapist per 5,000 people in India with unequal distribution
                </p>
              </div>
              <div className="p-4 bg-healthcare-surface rounded-lg">
                <h3 className="font-bold text-healthcare-text mb-2">High Cost</h3>
                <p className="text-healthcare-text-muted">
                  Offline sessions range ₹1,500-5,000 per hour, inaccessible for many
                </p>
              </div>
              <div className="p-4 bg-healthcare-surface rounded-lg">
                <h3 className="font-bold text-healthcare-text mb-2">Stigma</h3>
                <p className="text-healthcare-text-muted">
                  60% of affected individuals avoid seeking help due to fear of judgment
                </p>
              </div>
              <div className="p-4 bg-healthcare-surface rounded-lg">
                <h3 className="font-bold text-healthcare-text mb-2">Time Barriers</h3>
                <p className="text-healthcare-text-muted">
                  Long waiting lists (6-12 weeks) and inflexible scheduling
                </p>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section className="bg-white rounded-lg border border-healthcare-border p-8">
            <h2 className="text-3xl font-bold text-healthcare-text mb-6">Our Values</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-healthcare-text mb-2">🔒 Privacy First</h3>
                <p className="text-healthcare-text-muted">
                  HIPAA and GDPR compliant with end-to-end encryption
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-healthcare-text mb-2">🎯 Accessibility</h3>
                <p className="text-healthcare-text-muted">
                  Making quality mental healthcare accessible to everyone, everywhere
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-healthcare-text mb-2">✅ Quality</h3>
                <p className="text-healthcare-text-muted">
                  All therapists verified with proper credentials and licenses
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-healthcare-text mb-2">🤝 Empathy</h3>
                <p className="text-healthcare-text-muted">
                  Compassionate care centered around your unique mental health journey
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-brand-blue to-healthcare-lavender text-white rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 opacity-90">Join thousands who have found support through Innoma Healthcare</p>
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-white text-brand-blue rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors no-underline"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
