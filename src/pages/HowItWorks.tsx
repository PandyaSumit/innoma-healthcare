import { Link } from "react-router-dom";
import { useInView } from "../hooks/useInView";

const HowItWorks = () => {
  const [approachRef, approachInView] = useInView({ threshold: 0.1 });
  const [timelineRef, timelineInView] = useInView({ threshold: 0.05 });
  const [modelRef, modelInView] = useInView({ threshold: 0.1 });

  const steps = [
    {
      title: "Needs Assessment Session",
      description:
        "Answer a few quick questions and get a therapist recommendation right away.",
      icon: (
        <svg
          className="w-12 h-12 text-brand-blue"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      title: "Choose your Care Plan",
      description:
        "Decide on the number of sessions you would like to opt for.",
      icon: (
        <svg
          className="w-12 h-12 text-brand-orange"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Assigning of Therapist",
      description:
        "Choose the recommended therapist or talk to a matching expert who will connect you with the right therapist based on your needs.",
      icon: (
        <svg
          className="w-12 h-12 text-brand-blue"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      title: "Schedule your session",
      description:
        "Choose a convenient time slot and get an appointment with your therapist.",
      icon: (
        <svg
          className="w-12 h-12 text-brand-yellow"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Start Therapy",
      description:
        "At the scheduled time, join the session with your therapist using the mobile application or web browser.",
      icon: (
        <svg
          className="w-12 h-12 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  const modelSteps = [
    {
      step: "01",
      title: "Identification",
      description:
        "Identification of Symptoms & Dysfunctionalities in current life",
    },
    {
      step: "02",
      title: "Understanding",
      description:
        "Understanding underlying mal-coping mechanisms and negative patterns",
    },
    {
      step: "03",
      title: "Processing",
      description:
        "Identifying and processing root trauma and integrating it into a person’s life story",
    },
  ];

  return (
    <div className="min-h-screen bg-healthcare-surface">
      {/* Section 1: Our Approach */}
      <section
        ref={approachRef}
        className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-blue/5 to-white overflow-hidden"
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div
            className={`space-y-6 animate-on-scroll ${approachInView ? "is-visible" : ""}`}
          >
            <h2 className="text-brand-blue font-bold tracking-wider uppercase text-sm mb-2">
              Our Philosophy
            </h2>
            <h1 className="text-4xl md:text-5xl font-bold text-healthcare-text mb-6">
              Our Approach
            </h1>
            <div className="w-24 h-1.5 bg-brand-orange mx-auto rounded-full mb-8"></div>

            <p className="text-xl text-healthcare-text-muted leading-relaxed max-w-3xl mx-auto">
              We believe that mental illnesses can be treated beyond just
              managing symptoms. By following the{" "}
              <span className="font-semibold text-brand-blue">
                trauma model of psychotherapy
              </span>
              , which says that most mental illnesses are a result of complex
              trauma, we aim to work on the root cause and achieve higher levels
              of mental well-being.
            </p>

            <p className="text-lg text-healthcare-text-muted italic mt-4">
              Isolated mental health issues can also be dealt with through
              therapy.
            </p>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl"></div>
      </section>

      {/* Section 2: How It Works */}
      <section
        ref={timelineRef}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-healthcare-text mb-4">
              How It Works
            </h2>
            <p className="text-healthcare-text-muted text-lg max-w-2xl mx-auto">
              The most simple & convenient way to access talk therapy - anytime,
              anywhere, any device.
            </p>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-brand-blue/20 via-brand-blue/50 to-brand-blue/20 hidden md:block rounded-full"></div>

            <div className="space-y-12 md:space-y-24">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center animate-on-scroll stagger-${(index % 3) + 1} ${timelineInView ? "is-visible" : ""}`}
                >
                  {/* Timeline Node (Desktop) */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-brand-blue rounded-full z-10 hidden md:block"></div>

                  {/* Content Container */}
                  <div
                    className={`flex flex-col md:flex-row w-full items-center ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                  >
                    {/* Spacer for the other side */}
                    <div className="w-full md:w-1/2 p-4"></div>

                    {/* Card */}
                    <div
                      className={`w-full md:w-1/2 p-4 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}
                    >
                      <div
                        className={`flex flex-col items-center ${index % 2 === 0 ? "md:items-end" : "md:items-start"}`}
                      >
                        <div className="bg-white p-6 rounded-2xl shadow-clinical border border-healthcare-border hover:shadow-lg transition-all duration-300 w-full md:w-auto md:max-w-md group">
                          <div
                            className={`w-16 h-16 bg-healthcare-surface rounded-2xl flex items-center justify-center mb-4 mx-auto ${index % 2 === 0 ? "md:ml-auto md:mr-0" : "md:ml-0 md:mr-auto"} group-hover:scale-110 transition-transform duration-300`}
                          >
                            {step.icon}
                          </div>
                          <h3 className="text-xl font-bold text-healthcare-text mb-3">
                            {step.title}
                          </h3>
                          <p className="text-healthcare-text-muted leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Therapeutic Model */}
      <section
        ref={modelRef}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-healthcare-lavender-muted"
      >
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-16 animate-on-scroll ${modelInView ? "is-visible" : ""}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-healthcare-text mb-6">
              Trauma-Oriented Therapy
            </h2>
            <p className="text-xl text-healthcare-text-muted max-w-4xl mx-auto leading-relaxed">
              Trauma-Oriented Therapy views symptoms and dysfunctionalities as
              survival strategies that the mind creates to cope with painful
              experiences of the past. These natural responses may have helped a
              person stay safe in the past, but after a period when they are no
              longer needed, they can turn into mental illnesses.
            </p>
          </div>

          {/* 3 Step Process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {modelSteps.map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl p-8 shadow-clinical border border-healthcare-border relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 animate-on-scroll stagger-${index + 1} ${modelInView ? "is-visible" : ""}`}
              >
                <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-brand-blue/5 rounded-full group-hover:bg-brand-blue/10 transition-colors"></div>
                <div className="text-6xl font-bold text-healthcare-border/50 mb-4 font-sans">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-healthcare-text mb-4 group-hover:text-brand-blue transition-colors">
                  {item.title}
                </h3>
                <p className="text-healthcare-text-muted text-lg">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Model Explanation & Quote */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-on-scroll ${modelInView ? "is-visible" : ""}`}
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-healthcare-text">
                Trauma Model: Basis of Trauma-Oriented Therapy
              </h3>
              <p className="text-lg text-healthcare-text-muted leading-relaxed">
                Trauma-oriented therapy is a two-pronged approach where symptom
                relief is prioritised while working on the root trauma to
                provide a well-rounded solution and improve overall well-being.
              </p>
              <div className="p-6 bg-brand-orange/5 rounded-xl border border-brand-orange/10">
                <p className="text-brand-orange font-medium">
                  We try to work backwards to identify the root cause and
                  integrate it into your life story.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-healthcare-border relative">
              <svg
                className="absolute top-6 left-6 w-10 h-10 text-brand-blue/20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01703C7.91246 16 7.01703 16.8954 7.01703 18V21H14.017ZM21.017 21L21.017 18C21.017 16.8954 20.1216 16 19.017 16H16.017C14.9125 16 14.017 16.8954 14.017 18V21H21.017ZM10.517 7.5C10.517 9.98528 8.50231 12 6.01703 12C3.53175 12 1.51703 9.98528 1.51703 7.5C1.51703 5.01472 3.53175 3 6.01703 3C8.50231 3 10.517 5.01472 10.517 7.5ZM19.517 7.5C19.517 9.98528 17.5023 12 15.017 12C12.5318 12 10.517 9.98528 10.517 7.5C10.517 5.01472 12.5318 3 15.017 3C17.5023 3 19.517 5.01472 19.517 7.5Z" />
              </svg>
              <div className="pt-8">
                <p className="text-lg italic text-healthcare-text mb-6">
                  "The trauma model of mental disorders, or trauma model of
                  psychopathology, emphasises the effects of physical, sexual,
                  and psychological trauma as key causal factors in the
                  development of psychiatric disorders, including depression and
                  anxiety, as well as psychosis, whether the trauma is
                  experienced in childhood or adulthood."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                    Dr
                  </div>
                  <div>
                    <h4 className="font-bold text-healthcare-text">
                      Dr. Colin A. Ross
                    </h4>
                    <p className="text-sm text-healthcare-text-muted">
                      Psychiatrist & Researcher
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-healthcare-text mb-6">
            Ready to start your journey?
          </h2>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-brand-blue text-white rounded-full font-bold text-lg shadow-lg hover:bg-brand-dark-blue hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 no-underline"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
