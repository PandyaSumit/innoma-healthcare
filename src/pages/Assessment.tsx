import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Assessment = () => {
  const navigate = useNavigate();
  const [questionnaireStep, _setQuestionnaireStep] = useState(0);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<
    Record<string, string>
  >({});

  // ✅ Simplified 5 Question Healthcare Assessment
  const qus = [
    {
      title: "Initial Health Assessment",
      subtitle:
        "Please answer the following questions to help us understand your current health condition.",
      questions: [
        {
          text: "How would you rate your overall health?",
          options: ["Excellent", "Good", "Fair", "Poor"],
        },
        {
          text: "Do you currently have any diagnosed medical conditions?",
          options: [
            "No",
            "Yes – Physical condition",
            "Yes – Mental health condition",
            "Yes – Both",
          ],
        },
        {
          text: "Are you currently taking any prescribed medications?",
          options: ["No", "Occasionally", "Regularly"],
        },
        {
          text: "Have you experienced significant stress, anxiety, or emotional difficulties recently?",
          options: ["No", "Mild", "Moderate", "Severe"],
        },
        {
          text: "What type of support are you seeking today?",
          options: [
            "General Consultation",
            "Mental Health Support",
            "Chronic Condition Care",
            "Preventive Care",
          ],
        },
      ],
    },
  ];

  const handleComplete = () => {
    console.log("Assessment completed:", questionnaireAnswers);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-200 font-sans overflow-hidden">
      <div>
        <div className="mx-auto max-w-3xl md:min-w-max p-8 md:p-12 lg:p-16">
          <div className="w-full animate-fade-in">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-10">
              <Link to="/" className="inline-block no-underline">
                <span className="text-2xl font-bold tracking-tight text-brand-blue">
                  Innoma <span className="text-brand-orange">HC</span>
                </span>
              </Link>
            </div>

            {/* Progress Bar */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                {qus.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      questionnaireStep >= index
                        ? "w-12 bg-brand-blue"
                        : "w-4 bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Health Assessment
              </h1>
              <p className="text-sm text-gray-500 italic">
                Step {questionnaireStep + 1} of {qus.length}
              </p>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {qus[questionnaireStep].title}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {qus[questionnaireStep].subtitle}
              </p>

              <div className="space-y-6">
                {qus[questionnaireStep].questions.map((question, qnIndex) => (
                  <div key={qnIndex} className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">
                      {question.text}
                    </p>

                    <div className="flex flex-col md:flex-row gap-2">
                      {question.options.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`q-${qnIndex}`}
                            value={option}
                            checked={
                              questionnaireAnswers[`${qnIndex}`] === option
                            }
                            onChange={(e) =>
                              setQuestionnaireAnswers((prev) => ({
                                ...prev,
                                [`${qnIndex}`]: e.target.value,
                              }))
                            }
                            className="text-brand-blue focus:ring-brand-blue"
                          />
                          <span className="text-sm text-nowrap text-gray-700">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex sm:flex-row flex-col gap-3 pt-8">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 bg-white text-gray-700 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50"
                >
                  Skip
                </button>

                <button
                  type="button"
                  onClick={handleComplete}
                  className="flex-1 bg-brand-blue text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Complete Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
