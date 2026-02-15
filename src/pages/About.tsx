import { Link } from "react-router-dom";
import { useInView } from "../hooks/useInView";

const About = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [storyRef, storyInView] = useInView({ threshold: 0.1 });

  return (
    <div className="min-h-screen bg-healthcare-surface">
      {/* Hero / Questions Section */}
      <section
        ref={heroRef}
        className="bg-gradient-to-b from-white to-healthcare-surface py-20 px-4 sm:px-6 lg:px-8"
      >
        <div
          className={`max-w-4xl mx-auto text-center space-y-8 animate-on-scroll ${heroInView ? "is-visible" : ""}`}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-healthcare-text leading-tight">
            Have you ever wondered where your mental health issues come from?
          </h1>

          <div className="space-y-6 text-xl md:text-2xl text-healthcare-text-muted font-light leading-relaxed">
            <p
              className={`animate-on-scroll stagger-1 ${heroInView ? "is-visible" : ""}`}
            >
              Do they have a source or root cause?
            </p>
            <p
              className={`animate-on-scroll stagger-2 ${heroInView ? "is-visible" : ""}`}
            >
              Can they be treated or just managed?
            </p>
            <p
              className={`animate-on-scroll stagger-3 ${heroInView ? "is-visible" : ""}`}
            >
              Or is it a vast ocean of ambiguity, medications, and aimless
              therapy all your life?
            </p>
          </div>

          <div
            className={`pt-8 animate-on-scroll stagger-4 ${heroInView ? "is-visible" : ""}`}
          >
            <p className="text-2xl md:text-3xl font-bold text-brand-blue">
              Let’s find the answer to your illness!
            </p>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-healthcare-border to-transparent max-w-4xl mx-auto my-8 opacity-50"></div>

      {/* Founder's Story Section */}
      <section ref={storyRef} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div
            className={`text-center mb-12 animate-on-scroll ${storyInView ? "is-visible" : ""}`}
          >
            <h2 className="text-3xl font-bold text-healthcare-text mb-2">
              Founder’s Story
            </h2>
            <div className="w-20 h-1 bg-brand-blue mx-auto rounded-full"></div>
          </div>

          <div className="space-y-8 text-lg text-healthcare-text leading-relaxed font-sans">
            <div
              className={`bg-white p-8 md:p-12 rounded-2xl shadow-clinical border border-healthcare-border relative overflow-hidden animate-on-scroll stagger-1 ${storyInView ? "is-visible" : ""}`}
            >
              {/* Quote accent */}
              <div className="absolute top-0 left-0 -mt-4 -ml-4 text-9xl text-brand-blue/5 font-serif">
                "
              </div>

              <p className="mb-6 relative z-10">
                I was diagnosed with Bipolar Disorder when I was 18, and I
                thought,
                <span className="italic font-medium text-healthcare-text-emphasis">
                  {" "}
                  “It’s a chronic illness, and I’ll never get better.”
                </span>
                But my journey through therapy and self-help measures revealed
                that I had severe childhood trauma veiled under the mental
                illness that dominated my life.
              </p>

              <p className="mb-6">
                When I started uncovering the trauma, I could clearly see how my
                mind developed a mental illness in order to keep my trauma
                dissociated and keep me safe through my teenage and youth just
                as the body develops a fever as a mechanism to fight illness and
                prompts us to rest.
              </p>

              <p className="mb-6">
                Therapy, self-awareness and self-help slowly helped me rebuild
                my self esteem and mental balance and live a normal, meaningful
                life again. As I healed, I found myself becoming more open and
                compassionate towards my own story, and able to start life anew.
              </p>

              <p className="mb-6">
                Living in India, I also saw how mental illness and its treatment
                is still surrounded by stigma, even in urban spaces, let alone
                rural areas. Very few people have the courage, awareness, or
                access needed to reach out to a therapist. Recognizing this gap,
                I felt deeply inspired and duty bound to extend the same
                understanding and support that helped me, to innumerable others
                struggling with mental health challenges.
              </p>

              <p className="mb-6">
                My perspective towards mental illness completely changed through
                the trauma lens, and I knew these discoveries would enhance
                mental healthcare as we know it.
              </p>

              <p className="mb-8">
                I wanted to share these critical insights with the world as a
                ray of hope that mental illness is not undecipherable or
                unfixable. It just needs to be understood better.
              </p>

              <div className="bg-brand-blue/5 p-6 rounded-xl border border-brand-blue/10 text-center">
                <p className="text-xl font-bold text-brand-blue">
                  If I got better, you can too!
                </p>
              </div>
            </div>

            <div
              className={`text-center pt-8 animate-on-scroll stagger-2 ${storyInView ? "is-visible" : ""}`}
            >
              <p className="text-healthcare-text-muted italic">
                I, along with{" "}
                <span className="font-semibold text-healthcare-text">
                  Siddharth Chattopadhyaya
                </span>{" "}
                and{" "}
                <span className="font-semibold text-healthcare-text">
                  Dr. Eepsita Mishra
                </span>
                , joined hands to build this company with a shared vision to
                help others in their journey of healing.
              </p>
            </div>

            {/* Call to Action */}
            <div
              className={`mt-16 text-center animate-on-scroll stagger-3 ${storyInView ? "is-visible" : ""}`}
            >
              <Link
                to="/signup"
                className="inline-block px-10 py-4 bg-brand-blue text-white rounded-full font-bold text-lg shadow-lg hover:bg-brand-dark-blue hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 no-underline"
              >
                Start Your Healing Journey
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
