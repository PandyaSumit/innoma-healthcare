import React, { useState } from "react";

const LeadForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section
      id="get-care-plan"
      className="bg-brand-blue py-12 sm:py-16 lg:py-24"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* ================= LEFT CONTENT ================= */}
          <div className="text-white max-w-md">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-[2px] bg-brand-orange rounded-full" />
              <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-white/70">
                Get started
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
              Begin your journey to{" "}
              <span className="text-brand-orange">healing</span>
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-8">
              Receive a personalized care plan from trauma-informed specialists
              focused on long-term emotional wellbeing.
            </p>

            <div className="space-y-4">
              {[
                "Personalized assessment & guidance",
                "Expert trauma-informed specialists",
                "Safe and confidential consultation",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z"
                      />
                    </svg>
                  </span>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ================= FORM PANEL ================= */}
          <div
            className="
              bg-white
              rounded-[14px]
              border border-slate-200
              shadow-[0_12px_32px_rgba(0,0,0,0.08)]
              p-5 sm:p-6
            "
          >
            {isSubmitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg
                    className="w-7 h-7 text-brand-orange"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h3 className="text-lg font-semibold text-brand-blue-900 mb-2">
                  Thank you
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  A care specialist will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                {[
                  {
                    label: "Full name",
                    name: "name",
                    type: "text",
                    placeholder: "Jane Doe",
                  },
                  {
                    label: "Email address",
                    name: "email",
                    type: "email",
                    placeholder: "jane@example.com",
                  },
                  {
                    label: "Phone number",
                    name: "phone",
                    type: "tel",
                    placeholder: "+91 00000 00000",
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
                      {field.label}
                    </label>

                    <input
                      required
                      type={field.type}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="
                        w-full
                        rounded-lg
                        border border-slate-300
                        px-4 py-3
                        text-sm
                        text-brand-blue-900
                        placeholder:text-slate-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-brand-blue/20
                        transition
                      "
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  className="
                    w-full
                    py-3.5
                    rounded-lg
                    bg-brand-orange
                    text-white
                    text-sm
                    font-medium
                    hover:bg-brand-orange/90
                    transition
                    cursor-pointer
                  "
                >
                  Get your care plan
                </button>

                <p className="text-center text-[10px] uppercase tracking-widest text-slate-400">
                  Safe • Secure • Confidential
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadForm;
