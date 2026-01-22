const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-healthcare-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-healthcare-text mb-4">Privacy Policy</h1>
        <p className="text-sm text-healthcare-text-muted mb-8">Last Updated: January 4, 2026</p>

        <div className="bg-white rounded-lg border border-healthcare-border p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">1. Information We Collect</h2>
            <p className="text-healthcare-text-muted mb-4">We collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 text-healthcare-text-muted">
              <li>Personal Information (name, email, phone number, date of birth)</li>
              <li>Health Information (mental health conditions, session notes)</li>
              <li>Payment Information (securely processed through Razorpay)</li>
              <li>Usage Data (session logs, appointment history)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-healthcare-text-muted">
              <li>To provide mental health consultation services</li>
              <li>To schedule and facilitate therapy sessions</li>
              <li>To process payments securely</li>
              <li>To send appointment reminders via email and WhatsApp</li>
              <li>To improve our services through aggregated analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">3. Data Security</h2>
            <p className="text-healthcare-text-muted mb-4">
              We implement industry-standard security measures:
            </p>
            <ul className="list-disc list-inside space-y-2 text-healthcare-text-muted">
              <li>AES-256 encryption for data at rest</li>
              <li>TLS 1.3 for data in transit</li>
              <li>Regular security audits and penetration testing</li>
              <li>HIPAA and GDPR compliant infrastructure</li>
              <li>Data stored in secure servers in India (AWS Mumbai region)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">4. Data Sharing</h2>
            <p className="text-healthcare-text-muted">
              We do not sell your personal data. We only share data with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-healthcare-text-muted mt-4">
              <li>Your assigned therapist (for treatment purposes)</li>
              <li>Payment processors (Razorpay) for transaction processing</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">5. Your Rights</h2>
            <p className="text-healthcare-text-muted mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-healthcare-text-muted">
              <li>Access your personal data</li>
              <li>Request data correction or deletion</li>
              <li>Export your data (GDPR compliance)</li>
              <li>Withdraw consent for data processing</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">6. Cookies</h2>
            <p className="text-healthcare-text-muted">
              We use essential cookies for authentication and session management. You can control cookie
              preferences in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">7. Contact Us</h2>
            <p className="text-healthcare-text-muted">
              For privacy-related questions or to exercise your rights, contact us at:
              <br />
              <strong>Email:</strong> privacy@innoma-healthcare.com
              <br />
              <strong>Grievance Officer:</strong> Dr. Sameer Khan
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
