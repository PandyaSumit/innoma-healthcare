// import React from 'react';

// const Footer: React.FC = () => {
//   return (
//     <footer className="bg-brand-blue text-white py-20">
//       <div className="max-w-7xl mx-auto px-6 md:px-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
//           {/* Brand Section */}
//           <div className="lg:col-span-1">
//             <h2 className="text-2xl font-bold tracking-tight mb-6">
//               Innoma <span className="text-brand-orange">Healthcare</span>
//             </h2>
//             <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-[240px]">
//               Building healthier minds by tackling the root cause of mental illness.
//             </p>
//             <div className="space-y-6">
//               <div>
//                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Vision</h4>
//                 <p className="text-sm font-medium">Building healthier minds</p>
//               </div>
//               <div>
//                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Mission</h4>
//                 <p className="text-sm font-medium leading-relaxed">
//                   We aim to revolutionise mental healthcare by acknowledging childhood developmental trauma.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Links 1 */}
//           <div>
//             <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-8">Expertise</h4>
//             <ul className="space-y-4">
//               <li><a href="#therapists" className="text-sm text-white/70 hover:text-brand-orange transition-colors no-underline">Find a Specialist</a></li>
//               <li><a href="#specializations" className="text-sm text-white/70 hover:text-brand-orange transition-colors no-underline">Care Focus Areas</a></li>
//               <li><a href="#" className="text-sm text-white/70 hover:text-brand-orange transition-colors no-underline">Therapy Approach</a></li>
//               <li><a href="#" className="text-sm text-white/70 hover:text-brand-orange transition-colors no-underline">Patient Resources</a></li>
//             </ul>
//           </div>

//           {/* Links 2 */}
//           <div>
//             <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-8">Company</h4>
//             <ul className="space-y-4">
//               <li><a href="#about" className="text-sm text-white/70 hover:text-brand-orange transition-colors no-underline">About Our Mission</a></li>
//               <li><a href="#" className="text-sm text-white/70 hover:text-brand-orange transition-colors no-underline">Careers & Impact</a></li>
//               <li><a href="#" className="text-sm text-white/70 hover:text-brand-orange transition-colors no-underline">Contact Support</a></li>
//               <li><a href="#" className="text-sm text-white/70 hover:text-brand-orange transition-colors no-underline">Privacy & Terms</a></li>
//             </ul>
//           </div>

//           {/* Newsletter / CTA */}
//           <div>
//             <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-8">Stay Updated</h4>
//             <p className="text-sm text-white/70 mb-6 font-medium">
//               Insights on mental wellness, delivered to your inbox.
//             </p>
//             <form className="flex gap-2">
//               <input
//                 type="email"
//                 placeholder="Email address"
//                 className="bg-white/10 border border-white/10 rounded-md px-4 py-2.5 text-sm w-full focus:outline-none focus:border-brand-orange transition-colors text-white placeholder:text-white/30"
//               />
//               <button className="bg-brand-orange text-white px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-widest hover:bg-brand-orange/90 transition-colors">
//                 Join
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-white/30 uppercase tracking-widest">
//           <div className="flex gap-8">
//             <span>© 2026 INNOMA HEALTHCARE</span>
//             <span>ALL RIGHTS RESERVED</span>
//           </div>
//           <div className="flex gap-6">
//             <a href="#" className="hover:text-white transition-colors no-underline">Twitter</a>
//             <a href="#" className="hover:text-white transition-colors no-underline">LinkedIn</a>
//             <a href="#" className="hover:text-white transition-colors no-underline">Instagram</a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-blue text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-20">

        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-12">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Innoma <span className="text-brand-orange">Healthcare</span>
            </h2>

            <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-xs">
              Building healthier minds by tackling the root cause of mental illness.
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-2">
                  Vision
                </h4>
                <p className="text-sm font-medium">
                  Building healthier minds
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-2">
                  Mission
                </h4>
                <p className="text-sm font-medium leading-relaxed text-white/80">
                  We aim to revolutionise mental healthcare by acknowledging childhood developmental trauma.
                </p>
              </div>
            </div>
          </div>

          {/* Expertise */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-8">
              Expertise
            </h4>
            <ul className="space-y-4">
              {[
                "Find a Specialist",
                "Care Focus Areas",
                "Therapy Approach",
                "Patient Resources",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/70 hover:text-brand-orange transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-8">
              Company
            </h4>
            <ul className="space-y-4">
              {[
                "About Our Mission",
                "Careers & Impact",
                "Contact Support",
                "Privacy & Terms",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/70 hover:text-brand-orange transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-8">
              Stay Updated
            </h4>

            <p className="text-sm text-white/70 mb-6">
              Insights on mental wellness, delivered to your inbox.
            </p>

            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Email address"
                className="bg-white/10 border border-white/10 rounded-md px-4 py-3 text-sm w-full focus:outline-none focus:border-brand-orange transition text-white placeholder:text-white/40"
              />
              <button className="bg-brand-orange text-white px-6 py-3 rounded-md text-xs font-bold uppercase tracking-widest hover:bg-brand-orange/90 transition">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-20 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">

          <div className="flex flex-col sm:flex-row gap-4 text-[11px] text-white/40 font-semibold uppercase tracking-widest text-center sm:text-left">
            <span>© 2026 Innoma Healthcare</span>
            <span className="hidden sm:block">•</span>
            <span>All rights reserved</span>
          </div>

          <div className="flex gap-8 text-[11px] font-semibold uppercase tracking-widest text-white/40">
            {["Twitter", "LinkedIn", "Instagram"].map((social) => (
              <a
                key={social}
                href="#"
                className="hover:text-white transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


