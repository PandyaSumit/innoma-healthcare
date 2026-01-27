import { useState } from "react";

const Support = () => {
  const [activeTab, setActiveTab] = useState<"faq" | "contact" | "tickets">(
    "faq",
  );
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    category: "",
    subject: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      question: "How do I book my first appointment?",
      answer:
        'Browse our therapist directory, select a therapist that matches your needs, and click "Book Appointment". Choose your preferred date and time, complete the payment, and you\'ll receive a confirmation email with your session details.',
    },
    {
      question: "Can I reschedule or cancel my appointment?",
      answer:
        "Yes! You can reschedule up to 2 times per appointment (minimum 24 hours before). For cancellations: 48+ hours before gets full refund, 24-48 hours gets 50% refund, less than 24 hours has no refund.",
    },
    {
      question: "Is my information kept confidential?",
      answer:
        "Absolutely. We follow strict HIPAA and GDPR compliance standards. All session data is encrypted, and therapists are bound by patient-therapist confidentiality agreements.",
    },
    {
      question: "What if I have technical issues during my session?",
      answer:
        "Test your audio/video before the session using our built-in test feature. If issues arise during the session, try refreshing your browser or switching to a backup device. Contact support immediately if problems persist.",
    },
    {
      question: "How do I access my free assessment?",
      answer:
        "New users automatically receive one free 30-minute assessment session. Simply register, complete your profile, and book your free assessment from the dashboard.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit/debit cards, UPI, net banking, and digital wallets through our secure payment partner Razorpay.",
    },
    {
      question: "Can I switch therapists?",
      answer:
        "Yes, you can browse and book with any therapist at any time. We encourage finding the right fit for your mental health journey.",
    },
    {
      question: "How do I download my session notes or invoices?",
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
      setContactForm({ category: "", subject: "", description: "" });
    }, 3000);
  };

  return (
    <div>
      <div>
        {/* ================= HEADER ================= */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-healthcare-text">
            Support Center
          </h1>
          <p className="text-sm text-healthcare-text-muted mt-1">
            Get help, find answers, or contact our support team
          </p>
        </div>

        {/* ================= TABS ================= */}
        <div className="flex gap-3 mb-6 border-b border-healthcare-border overflow-x-auto no-scrollbar">
          {[
            { id: "faq", label: "FAQs" },
            { id: "contact", label: "Contact" },
            { id: "tickets", label: "My Tickets" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 cursor-pointer sm:px-6 py-3 text-sm sm:text-base font-semibold whitespace-nowrap relative transition ${
                activeTab === tab.id
                  ? "text-brand-blue"
                  : "text-healthcare-text-muted hover:text-healthcare-text"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" />
              )}
            </button>
          ))}
        </div>

        {/* ================= FAQ ================= */}
        {activeTab === "faq" && (
          <div className="space-y-4">
            <div className="bg-white border border-healthcare-border rounded-xl p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-healthcare-text mb-2">
                Frequently Asked Questions
              </h3>
              <p className="text-sm text-healthcare-text-muted mb-4">
                Quick answers to common questions
              </p>

              <div className="relative">
                <input
                  placeholder="Search questions..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-healthcare-border focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm"
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
              <div
                key={index}
                className="bg-white border border-healthcare-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-healthcare-surface transition"
                >
                  <span className="font-medium text-healthcare-text">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 transition ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {expandedFaq === index && (
                  <div className="px-5 pb-4 text-sm text-healthcare-text-muted border-t border-healthcare-border pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ================= CONTACT ================= */}
        {activeTab === "contact" && (
          <div className="bg-white border border-healthcare-border rounded-xl p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-healthcare-text mb-5">
              Contact Support
            </h3>

            {submitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h4 className="font-semibold text-healthcare-text mb-1">
                  Ticket submitted
                </h4>
                <p className="text-sm text-healthcare-text-muted">
                  Our support team will contact you within 24 hours
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <select
                  required
                  value={contactForm.category}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, category: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-healthcare-border rounded-lg text-sm"
                >
                  <option value="">Select issue category</option>
                  <option value="booking">Booking issue</option>
                  <option value="technical">Technical problem</option>
                  <option value="payment">Payment & billing</option>
                  <option value="therapist">Therapist concern</option>
                  <option value="other">Other</option>
                </select>

                <input
                  required
                  placeholder="Subject"
                  value={contactForm.subject}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-healthcare-border rounded-lg text-sm"
                />

                <textarea
                  required
                  rows={5}
                  placeholder="Describe your issue..."
                  value={contactForm.description}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-healthcare-border rounded-lg text-sm resize-none"
                />

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-blue text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Submit ticket
                </button>
              </form>
            )}
          </div>
        )}

        {/* ================= TICKETS ================= */}
        {activeTab === "tickets" && (
          <div className="bg-white border border-healthcare-border rounded-xl p-10 text-center">
            <svg
              className="w-14 h-14 mx-auto mb-4 text-healthcare-text-muted"
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

            <h3 className="text-lg font-semibold text-healthcare-text mb-1">
              No tickets yet
            </h3>
            <p className="text-sm text-healthcare-text-muted mb-6">
              You haven’t created any support tickets
            </p>

            <button
              onClick={() => setActiveTab("contact")}
              className="px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:opacity-90"
            >
              Create ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
