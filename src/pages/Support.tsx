import { useState } from 'react';

const Support = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'tickets'>('faq');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    category: '',
    subject: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      question: 'How do I book my first appointment?',
      answer:
        'Browse our therapist directory, select a therapist that matches your needs, and click "Book Appointment". Choose your preferred date and time, complete the payment, and you\'ll receive a confirmation email with your session details.',
    },
    {
      question: 'Can I reschedule or cancel my appointment?',
      answer:
        'Yes! You can reschedule up to 2 times per appointment (minimum 24 hours before). For cancellations: 48+ hours before gets full refund, 24-48 hours gets 50% refund, less than 24 hours has no refund.',
    },
    {
      question: 'Is my information kept confidential?',
      answer:
        'Absolutely. We follow strict HIPAA and GDPR compliance standards. All session data is encrypted, and therapists are bound by patient-therapist confidentiality agreements.',
    },
    {
      question: 'What if I have technical issues during my session?',
      answer:
        'Test your audio/video before the session using our built-in test feature. If issues arise during the session, try refreshing your browser or switching to a backup device. Contact support immediately if problems persist.',
    },
    {
      question: 'How do I access my free assessment?',
      answer:
        'New users automatically receive one free 30-minute assessment session. Simply register, complete your profile, and book your free assessment from the dashboard.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit/debit cards, UPI, net banking, and digital wallets through our secure payment partner Razorpay.',
    },
    {
      question: 'Can I switch therapists?',
      answer:
        'Yes, you can browse and book with any therapist at any time. We encourage finding the right fit for your mental health journey.',
    },
    {
      question: 'How do I download my session notes or invoices?',
      answer:
        'Visit your Appointments page, select a past session, and click "View Notes" or "Download Invoice". All documents are accessible from your dashboard.',
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactForm({ category: '', subject: '', description: '' });
    }, 3000);
  };

  return (
    <div>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-healthcare-text mb-2">Support Center</h1>
          <p className="text-healthcare-text-muted">Find answers and get help with your queries</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-healthcare-border">
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-3 font-semibold transition-colors relative cursor-pointer ${
              activeTab === 'faq'
                ? 'text-brand-blue'
                : 'text-healthcare-text-muted hover:text-healthcare-text'
            }`}
          >
            FAQs
            {activeTab === 'faq' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" />}
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 font-semibold transition-colors relative cursor-pointer ${
              activeTab === 'contact'
                ? 'text-brand-blue'
                : 'text-healthcare-text-muted hover:text-healthcare-text'
            }`}
          >
            Contact Us
            {activeTab === 'contact' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-6 py-3 font-semibold transition-colors relative cursor-pointer ${
              activeTab === 'tickets'
                ? 'text-brand-blue'
                : 'text-healthcare-text-muted hover:text-healthcare-text'
            }`}
          >
            My Tickets
            {activeTab === 'tickets' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" />
            )}
          </button>
        </div>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-healthcare-border p-6 mb-6">
              <h3 className="text-xl font-bold text-healthcare-text mb-4">Frequently Asked Questions</h3>
              <p className="text-healthcare-text-muted mb-4">
                Find quick answers to common questions about using Innoma Healthcare
              </p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-healthcare-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg border border-healthcare-border overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-healthcare-surface transition-colors"
                >
                  <span className="font-semibold text-healthcare-text">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-healthcare-text-muted transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4 text-healthcare-text-muted border-t border-healthcare-border pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-lg border border-healthcare-border p-8">
            <h3 className="text-2xl font-bold text-healthcare-text mb-6">Contact Support</h3>

            {submitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-healthcare-text mb-2">Message Sent!</h4>
                <p className="text-healthcare-text-muted">
                  We've received your message and will respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-healthcare-text mb-2">
                    Issue Category
                  </label>
                  <select
                    value={contactForm.category}
                    onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none"
                  >
                    <option value="">Select a category</option>
                    <option value="booking">Booking Issues</option>
                    <option value="technical">Technical Problems</option>
                    <option value="payment">Payment & Billing</option>
                    <option value="therapist">Therapist Concerns</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-healthcare-text mb-2">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    required
                    placeholder="Brief description of your issue"
                    className="w-full px-4 py-3 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-healthcare-text mb-2">
                    Description
                  </label>
                  <textarea
                    value={contactForm.description}
                    onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })}
                    required
                    rows={6}
                    placeholder="Please provide detailed information about your issue..."
                    className="w-full px-4 py-3 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-brand-blue text-white rounded-lg font-bold hover:bg-healthcare-text transition-colors"
                >
                  Submit Ticket
                </button>
              </form>
            )}

            {/* Contact Info */}
            <div className="mt-8 pt-8 border-t border-healthcare-border">
              <h4 className="font-bold text-healthcare-text mb-4">Other Ways to Reach Us</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-healthcare-text">support@innoma-healthcare.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-healthcare-text">+91 1800-123-4567 (10 AM - 8 PM IST)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-healthcare-border p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-healthcare-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-bold text-healthcare-text mb-2">No Support Tickets</h3>
              <p className="text-healthcare-text-muted mb-6">You haven't submitted any support tickets yet</p>
              <button
                onClick={() => setActiveTab('contact')}
                className="px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-healthcare-text transition-colors cursor-pointer"
              >
                Create Ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
