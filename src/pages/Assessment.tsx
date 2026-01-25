import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { THERAPISTS } from '../data/therapists';
import { useBooking } from '../context/BookingContext';
import { useAppointments } from '../context/AppointmentContext';
import { useToast } from '../context/ToastContext';

type Step = 'questionnaire' | 'therapist' | 'schedule' | 'confirm';

const Assessment = () => {
  const navigate = useNavigate();
  const { setTherapist, setDateTime, setIsAssessment } = useBooking();
  const { addAppointment } = useAppointments();
  const { success } = useToast();

  const [currentStep, setCurrentStep] = useState<Step>('questionnaire');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [preferredGender, setPreferredGender] = useState<string>('');
  const [preferredLanguage, setPreferredLanguage] = useState<string>('');
  const [matchedTherapist, setMatchedTherapist] = useState<typeof THERAPISTS[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const concerns = [
    { id: 'anxiety', label: 'Anxiety', icon: '😰' },
    { id: 'depression', label: 'Depression', icon: '😔' },
    { id: 'stress', label: 'Stress', icon: '😤' },
    { id: 'sleep', label: 'Sleep Issues', icon: '😴' },
    { id: 'relationships', label: 'Relationships', icon: '💔' },
    { id: 'work', label: 'Work Stress', icon: '💼' },
    { id: 'trauma', label: 'Trauma', icon: '🩹' },
    { id: 'self-esteem', label: 'Self-Esteem', icon: '🪞' },
  ];

  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Gujarati', 'Marathi'];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  ];

  // Generate next 14 days
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0) { // Skip Sundays
        dates.push(date);
      }
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const toggleConcern = (concernId: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concernId)
        ? prev.filter((c) => c !== concernId)
        : [...prev, concernId]
    );
  };

  const findMatchingTherapist = () => {
    // Simple matching algorithm based on specializations
    const concernToSpec: Record<string, string[]> = {
      anxiety: ['Anxiety', 'Panic Disorders'],
      depression: ['Depression'],
      stress: ['Stress Management', 'Work Stress', 'Burnout'],
      sleep: ['Sleep Disorders'],
      relationships: ['Relationship Issues', 'Marriage Counseling', 'Family Therapy'],
      work: ['Work Stress', 'Burnout', 'Stress Management'],
      trauma: ['Trauma', 'PTSD'],
      'self-esteem': ['Self-Esteem'],
    };

    const relevantSpecs = selectedConcerns.flatMap((c) => concernToSpec[c] || []);

    let bestMatch = THERAPISTS[0];
    let bestScore = 0;

    THERAPISTS.forEach((therapist) => {
      let score = 0;

      // Match specializations
      therapist.specializations.forEach((spec) => {
        if (relevantSpecs.includes(spec)) score += 3;
      });

      // Match language
      if (preferredLanguage && therapist.languages.includes(preferredLanguage)) {
        score += 2;
      }

      // Match gender preference
      if (preferredGender && therapist.gender === preferredGender) {
        score += 1;
      }

      // Availability bonus
      if (therapist.availability === 'Available Today') score += 1;

      // Rating bonus
      score += therapist.rating;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = therapist;
      }
    });

    return bestMatch;
  };

  const handleQuestionnaireSubmit = () => {
    if (selectedConcerns.length === 0) return;

    const matched = findMatchingTherapist();
    setMatchedTherapist(matched);
    setTherapist(matched);
    setIsAssessment(true);
    setCurrentStep('therapist');
  };

  const handleScheduleSubmit = () => {
    if (!selectedDate || !selectedTime || !matchedTherapist) return;

    setDateTime(selectedDate, selectedTime);

    // Create the appointment
    addAppointment({
      therapistId: matchedTherapist.id,
      therapistName: matchedTherapist.name,
      therapistPhoto: matchedTherapist.photo,
      specialization: matchedTherapist.specializations[0],
      date: selectedDate,
      time: selectedTime,
      duration: 30,
      type: 'Assessment',
      status: 'Upcoming',
      fee: 0,
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      reschedulesLeft: 2,
      paymentStatus: 'Paid',
    });

    setCurrentStep('confirm');
  };

  const handleComplete = () => {
    success('Assessment Booked!', 'Check your email and WhatsApp for confirmation.');
    navigate('/dashboard');
  };

  const steps = [
    { id: 'questionnaire', label: 'Tell Us About You', number: 1 },
    { id: 'therapist', label: 'Your Match', number: 2 },
    { id: 'schedule', label: 'Pick a Time', number: 3 },
    { id: 'confirm', label: 'Confirmed', number: 4 },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Progress Steps */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-healthcare-border hidden md:block" />
          <div
            className="absolute left-0 top-5 h-0.5 bg-brand-blue transition-all duration-500 hidden md:block"
            style={{ width: `${(steps.findIndex((s) => s.id === currentStep) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = steps.findIndex((s) => s.id === currentStep) > index;

            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-brand-blue text-white scale-110 shadow-lg shadow-brand-blue/30'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-white border-2 border-healthcare-border text-healthcare-text-muted'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium hidden md:block ${isActive ? 'text-brand-blue' : 'text-healthcare-text-muted'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-clinical border border-healthcare-border p-6 md:p-10">
        {/* Questionnaire Step */}
        {currentStep === 'questionnaire' && (
          <div className="animate-fade-in">
            <div className="text-center mb-8 md:mb-10">
              <h1 className="text-2xl md:text-3xl font-bold text-healthcare-text mb-3">
                What brings you here today?
              </h1>
              <p className="text-healthcare-text-muted max-w-lg mx-auto">
                Select all that apply. This helps us match you with the right therapist for your free assessment.
              </p>
            </div>

            {/* Concerns Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
              {concerns.map((concern) => {
                const isSelected = selectedConcerns.includes(concern.id);
                return (
                  <button
                    key={concern.id}
                    onClick={() => toggleConcern(concern.id)}
                    className={`p-4 md:p-6 rounded-xl border-2 transition-all duration-200 text-center ${
                      isSelected
                        ? 'border-brand-blue bg-brand-blue/5 shadow-md'
                        : 'border-healthcare-border bg-white hover:border-brand-blue/30 hover:bg-healthcare-surface'
                    }`}
                  >
                    <span className="text-2xl md:text-3xl mb-2 block">{concern.icon}</span>
                    <span className={`text-sm font-medium ${isSelected ? 'text-brand-blue' : 'text-healthcare-text'}`}>
                      {concern.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Preferences */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-healthcare-text mb-2">
                  Preferred Therapist Gender (Optional)
                </label>
                <div className="flex gap-3">
                  {['Female', 'Male', 'No Preference'].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setPreferredGender(gender === 'No Preference' ? '' : gender)}
                      className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                        (gender === 'No Preference' && !preferredGender) || preferredGender === gender
                          ? 'border-brand-blue bg-brand-blue/5 text-brand-blue'
                          : 'border-healthcare-border text-healthcare-text-muted hover:border-brand-blue/30'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-healthcare-text mb-2">
                  Preferred Language (Optional)
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full py-3 px-4 rounded-lg border border-healthcare-border text-healthcare-text focus:border-brand-blue outline-none"
                >
                  <option value="">Any Language</option>
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleQuestionnaireSubmit}
              disabled={selectedConcerns.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                selectedConcerns.length > 0
                  ? 'bg-brand-blue text-white hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20'
                  : 'bg-healthcare-border text-healthcare-text-muted cursor-not-allowed'
              }`}
            >
              Find My Therapist Match
            </button>
          </div>
        )}

        {/* Therapist Match Step */}
        {currentStep === 'therapist' && matchedTherapist && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Perfect Match Found!
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-healthcare-text mb-2">
                We've found your therapist
              </h1>
              <p className="text-healthcare-text-muted">
                Based on your preferences, we recommend:
              </p>
            </div>

            {/* Therapist Card */}
            <div className="bg-gradient-to-br from-brand-blue/5 to-healthcare-lavender/5 rounded-2xl p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <img
                  src={matchedTherapist.photo}
                  alt={matchedTherapist.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover shadow-lg"
                />
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-healthcare-text mb-1">
                    {matchedTherapist.name}
                  </h3>
                  <p className="text-sm text-healthcare-text-muted mb-3">
                    {matchedTherapist.qualifications}
                  </p>

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    {matchedTherapist.specializations.slice(0, 3).map((spec) => (
                      <span
                        key={spec}
                        className="px-3 py-1 bg-white rounded-full text-xs font-medium text-brand-blue border border-brand-blue/20"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold text-healthcare-text">{matchedTherapist.rating}</span>
                      <span className="text-healthcare-text-muted">({matchedTherapist.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-healthcare-text-muted">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {matchedTherapist.experience} years experience
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/50">
                <p className="text-sm text-healthcare-text-muted italic">
                  "{matchedTherapist.bio}"
                </p>
              </div>
            </div>

            {/* Free Assessment Badge */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-green-800">Your First Assessment is FREE!</p>
                <p className="text-sm text-green-700">30-minute introductory session to discuss your concerns</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setCurrentStep('questionnaire')}
                className="flex-1 py-3 px-6 rounded-xl font-medium text-healthcare-text border border-healthcare-border hover:bg-healthcare-surface transition-all"
              >
                Try Different Preferences
              </button>
              <button
                onClick={() => setCurrentStep('schedule')}
                className="flex-1 py-4 px-6 rounded-xl font-bold text-white bg-brand-blue hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20 transition-all"
              >
                Continue with {matchedTherapist.name.split(' ')[0]}
              </button>
            </div>
          </div>
        )}

        {/* Schedule Step */}
        {currentStep === 'schedule' && matchedTherapist && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-healthcare-text mb-2">
                Choose your assessment time
              </h1>
              <p className="text-healthcare-text-muted">
                Select a convenient date and time for your free 30-minute session
              </p>
            </div>

            {/* Date Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-healthcare-text mb-3">
                Select Date
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {getAvailableDates().map((date) => {
                  const dateStr = formatDate(date);
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`flex-shrink-0 w-20 py-3 px-2 rounded-xl text-center transition-all ${
                        isSelected
                          ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                          : 'bg-healthcare-surface text-healthcare-text hover:bg-brand-blue/10 border border-healthcare-border'
                      }`}
                    >
                      <div className="text-xs opacity-80">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-lg font-bold">
                        {date.getDate()}
                      </div>
                      <div className="text-xs opacity-80">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-healthcare-text mb-3">
                Select Time
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {timeSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  const hour = parseInt(time.split(':')[0]);
                  const period = hour >= 12 ? 'PM' : 'AM';
                  const displayHour = hour > 12 ? hour - 12 : hour;
                  const displayTime = `${displayHour}:${time.split(':')[1]} ${period}`;

                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-brand-blue text-white shadow-md'
                          : 'bg-healthcare-surface text-healthcare-text hover:bg-brand-blue/10 border border-healthcare-border'
                      }`}
                    >
                      {displayTime}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            {selectedDate && selectedTime && (
              <div className="bg-healthcare-surface rounded-xl p-4 mb-8 flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-blue/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-healthcare-text-muted">Your selected time</p>
                  <p className="font-semibold text-healthcare-text">
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setCurrentStep('therapist')}
                className="flex-1 py-3 px-6 rounded-xl font-medium text-healthcare-text border border-healthcare-border hover:bg-healthcare-surface transition-all"
              >
                Back
              </button>
              <button
                onClick={handleScheduleSubmit}
                disabled={!selectedDate || !selectedTime}
                className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all ${
                  selectedDate && selectedTime
                    ? 'bg-brand-blue text-white hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20'
                    : 'bg-healthcare-border text-healthcare-text-muted cursor-not-allowed'
                }`}
              >
                Confirm Free Assessment
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Step */}
        {currentStep === 'confirm' && matchedTherapist && (
          <div className="animate-fade-in text-center">
            {/* Success Animation */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-healthcare-text mb-2">
              Assessment Booked!
            </h1>
            <p className="text-healthcare-text-muted mb-8 max-w-md mx-auto">
              Your free assessment with {matchedTherapist.name} has been confirmed.
            </p>

            {/* Booking Details */}
            <div className="bg-healthcare-surface rounded-2xl p-6 mb-8 text-left max-w-md mx-auto">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-healthcare-border">
                <img
                  src={matchedTherapist.photo}
                  alt={matchedTherapist.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <p className="font-semibold text-healthcare-text">{matchedTherapist.name}</p>
                  <p className="text-sm text-healthcare-text-muted">Free Assessment • 30 minutes</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-healthcare-text">
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-healthcare-text">{selectedTime} IST</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-healthcare-text">Video Consultation (Google Meet)</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-left max-w-md mx-auto">
              <p className="font-semibold text-blue-800 mb-2">What's Next?</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirmation email sent to your inbox
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  WhatsApp reminder 24 hours before
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Join link available 15 minutes before
                </li>
              </ul>
            </div>

            <button
              onClick={handleComplete}
              className="w-full max-w-md py-4 rounded-xl font-bold text-white bg-brand-blue hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessment;
