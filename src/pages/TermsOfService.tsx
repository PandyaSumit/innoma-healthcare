const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-healthcare-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-healthcare-text mb-4">Terms of Service</h1>
        <p className="text-sm text-healthcare-text-muted mb-8">Last Updated: January 4, 2026</p>

        <div className="bg-white rounded-lg border border-healthcare-border p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">1. Acceptance of Terms</h2>
            <p className="text-healthcare-text-muted">
              By accessing and using Innoma Healthcare services, you accept and agree to be bound by these Terms
              of Service. If you disagree with any part of these terms, you may not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">2. Eligibility</h2>
            <p className="text-healthcare-text-muted mb-4">You must be:</p>
            <ul className="list-disc list-inside space-y-2 text-healthcare-text-muted">
              <li>At least 18 years of age</li>
              <li>Legally capable of entering into binding contracts</li>
              <li>Not prohibited by law from using our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">3. Services Provided</h2>
            <p className="text-healthcare-text-muted mb-4">Innoma Healthcare provides:</p>
            <ul className="list-disc list-inside space-y-2 text-healthcare-text-muted">
              <li>Online mental health consultation platform</li>
              <li>Therapist directory and booking system</li>
              <li>Secure video conferencing for therapy sessions</li>
              <li>Appointment management and reminders</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">4. User Responsibilities</h2>
            <p className="text-healthcare-text-muted mb-4">You agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-healthcare-text-muted">
              <li>Provide accurate and complete information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Attend scheduled appointments or cancel with appropriate notice</li>
              <li>Treat therapists with respect and professionalism</li>
              <li>Not misuse the platform for any illegal or harmful activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">5. Booking & Cancellation Policy</h2>
            <p className="text-healthcare-text-muted mb-4">
              <strong>Booking:</strong> All appointments must be booked through our platform with payment
              confirmation.
            </p>
            <p className="text-healthcare-text-muted mb-4">
              <strong>Cancellation & Refunds:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-healthcare-text-muted">
              <li>Cancel 48+ hours before: Full refund</li>
              <li>Cancel 24-48 hours before: 50% refund</li>
              <li>Cancel less than 24 hours before: No refund</li>
              <li>No-show without notice: No refund</li>
            </ul>
            <p className="text-healthcare-text-muted mt-4">
              <strong>Rescheduling:</strong> You may reschedule up to 2 times per appointment, with at least 24
              hours notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">6. Payment Terms</h2>
            <p className="text-healthcare-text-muted mb-4">
              Payments are processed securely through Razorpay. All fees are in Indian Rupees (INR) and include
              18% GST. Subscription packages auto-renew unless canceled before the renewal date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">7. Therapist-Patient Relationship</h2>
            <p className="text-healthcare-text-muted mb-4">
              The platform facilitates connections between patients and licensed therapists. The therapeutic
              relationship is between you and your chosen therapist. Innoma Healthcare is not responsible for
              the quality or outcomes of therapy sessions.
            </p>
            <p className="text-healthcare-text-muted">
              <strong>Emergency Services:</strong> This platform is not for emergencies. In case of a mental
              health crisis, please contact emergency services immediately (dial 112 in India).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">8. Intellectual Property</h2>
            <p className="text-healthcare-text-muted">
              All content on this platform (logos, text, graphics, software) is owned by Innoma Healthcare and
              protected by copyright and trademark laws. You may not reproduce, distribute, or create derivative
              works without explicit permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">9. Limitation of Liability</h2>
            <p className="text-healthcare-text-muted">
              Innoma Healthcare is not liable for any indirect, incidental, or consequential damages arising
              from your use of the platform. Our total liability shall not exceed the amount you paid for
              services in the past 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">10. Termination</h2>
            <p className="text-healthcare-text-muted">
              We reserve the right to suspend or terminate your account if you violate these terms or engage in
              fraudulent, abusive, or illegal activities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">11. Governing Law</h2>
            <p className="text-healthcare-text-muted">
              These terms are governed by the laws of India. Disputes shall be resolved through arbitration in
              Mumbai, Maharashtra.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-healthcare-text mb-4">12. Contact Information</h2>
            <p className="text-healthcare-text-muted">
              For questions about these Terms of Service:
              <br />
              <strong>Email:</strong> legal@innoma-healthcare.com
              <br />
              <strong>Address:</strong> Mumbai, Maharashtra, India
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
