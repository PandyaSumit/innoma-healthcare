import React, { useState } from 'react';

const LeadForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="get-care-plan" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-12">
        <div className="bg-brand-blue rounded-2xl p-4 sm:p-8 md:p-16 lg:p-20 relative overflow-hidden shadow-xl">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            {/* Content Side */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-8 h-1 bg-brand-orange rounded-full"></span>
                <span className="text-xs font-bold tracking-widest uppercase text-white/60">GET STARTED</span>
              </div>
              
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-8">
                Begin your journey to 
                <span className="text-brand-orange"> healing</span>.
              </h2>
              
              <p className="text-lg text-white/80 mb-10 leading-relaxed max-w-lg">
                Connect with us to receive a personalized care plan tailored to your unique needs. Our experts are here to guide you back to your authentic self.
              </p>
              
              <div className="space-y-6">
                {[
                  "Personalized assessment & guidance",
                  "Expert trauma-informed specialists",
                  "Safe and confidential consultation"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-brand-orange flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white font-medium text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Side */}
            <div className="bg-white rounded-xl p-6 sm:p-8 md:p-10 shadow-lg w-full max-w-full">
              {isSubmitted ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <svg className="w-10 h-10 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-brand-blue mb-4">Thank You!</h3>
                  <p className="text-gray-500 text-lg">
                    We've received your information. A care specialist will reach out to you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 px-8 py-3 rounded-md border border-gray-200 text-brand-blue font-bold hover:bg-gray-50 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 sm:px-5 sm:py-4 text-brand-blue placeholder:text-gray-300 focus:outline-none focus:border-brand-blue/50 focus:bg-white transition-all font-medium"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 sm:px-5 sm:py-4 text-brand-blue placeholder:text-gray-300 focus:outline-none focus:border-brand-blue/50 focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 00000 00000"
                      className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 sm:px-5 sm:py-4 text-brand-blue placeholder:text-gray-300 focus:outline-none focus:border-brand-blue/50 focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 sm:py-5 bg-brand-orange text-white text-base font-bold rounded-md transition-all hover:bg-brand-orange/90 shadow-lg shadow-brand-orange/20"
                  >
                    Get your care plan
                  </button>
                  
                  <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    Safe • Secure • Confidential
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadForm;

