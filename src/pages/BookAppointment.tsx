import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchTherapistById } from '../api/therapist.api';
import { fetchFreeAssessmentEligibility, fetchTherapistAvailability } from '../api/appointment.api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';

const PACKAGES = [
  { id: 'single', name: 'Single Session', price: 1999, sessions: 1, description: '1x 50-min consultation' },
  {
    id: 'starter',
    name: 'Starter Package',
    price: 4999,
    sessions: 4,
    description: '4 sessions/month (₹1,250 per session)',
  },
  {
    id: 'professional',
    name: 'Professional Package',
    price: 8999,
    sessions: 8,
    description: '8 sessions/month (₹1,125 per session)',
  },
];

const DEFAULT_TIME_SLOTS = [
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00',
];

function formatTimeDisplay(time: string): string {
  const [hStr, mStr] = time.split(':');
  const h = parseInt(hStr);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${mStr} ${period}`;
}

const BookAppointment = () => {
  const { therapistId } = useParams<{ therapistId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [therapist, setTherapist] = useState<any>(null);
  const [loadingTherapist, setLoadingTherapist] = useState(true);
  const [freeAssessmentEligible, setFreeAssessmentEligible] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState('single');
  const [isFreeAssessment, setIsFreeAssessment] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>(DEFAULT_TIME_SLOTS);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch therapist data from API
  useEffect(() => {
    if (!therapistId) return;
    setLoadingTherapist(true);
    fetchTherapistById(therapistId)
      .then(setTherapist)
      .catch(() => setTherapist(null))
      .finally(() => setLoadingTherapist(false));
  }, [therapistId]);

  // Check free assessment eligibility for logged in patients
  useEffect(() => {
    if (user?.role === 'patient') {
      fetchFreeAssessmentEligibility()
        .then(({ eligible }) => {
          setFreeAssessmentEligible(eligible);
          if (eligible) {
            setIsFreeAssessment(true);
            setSelectedPackage('free_assessment');
          }
        })
        .catch(() => setFreeAssessmentEligible(false));
    }
  }, [user]);

  // Fetch availability slots when date changes
  useEffect(() => {
    if (!selectedDate || !therapistId) return;
    setLoadingSlots(true);
    setSelectedTime('');
    fetchTherapistAvailability(therapistId, selectedDate)
      .then(({ available }) => {
        setAvailableSlots(available.length > 0 ? available : DEFAULT_TIME_SLOTS);
      })
      .catch(() => {
        setAvailableSlots(DEFAULT_TIME_SLOTS);
      })
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, therapistId]);

  if (loadingTherapist) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-healthcare-text mb-4">Therapist not found</h2>
          <Link
            to="/find-therapist"
            className="px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-healthcare-text transition-colors"
          >
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  // Generate next 14 days for date selection
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const selectedPkg = isFreeAssessment
    ? { id: 'free_assessment', name: 'Free Assessment', price: 0, sessions: 1, description: 'Complimentary 50-min assessment session' }
    : PACKAGES.find((p) => p.id === selectedPackage);

  const canProceed = selectedDate && selectedTime;
  const totalAmount = isFreeAssessment ? 0 : Math.round((selectedPkg?.price || 0) * 1.18);

  const handleProceedToCheckout = () => {
    if (!canProceed) return;

    // Convert time from "09:00" to "09:00 AM" format for display, keep 24h for API
    const timeDisplay = formatTimeDisplay(selectedTime);

    navigate('/checkout', {
      state: {
        therapist: {
          id: therapist.id,
          name: therapist.name,
          photo: therapist.avatar_url || therapist.photo,
          specializations: therapist.specializations || [therapist.specialization],
        },
        package: {
          ...selectedPkg,
          id: isFreeAssessment ? 'free_assessment' : selectedPackage,
        },
        date: selectedDate,
        time: selectedTime,
        timeDisplay,
        isFreeAssessment,
        therapistId,
      },
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-healthcare-text-muted hover:text-healthcare-text transition-colors mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-healthcare-text">Book Appointment</h1>
        <p className="text-healthcare-text-muted mt-1">Complete the steps below to schedule your session</p>
      </div>

      <div>
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">1</div>
              <span className="text-xs sm:text-sm font-semibold text-healthcare-text hidden xs:inline">Select Package</span>
            </div>
            <div className="h-px w-8 sm:w-16 bg-healthcare-border" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">2</div>
              <span className="text-xs sm:text-sm font-semibold text-healthcare-text hidden xs:inline">Date & Time</span>
            </div>
            <div className="h-px w-8 sm:w-16 bg-healthcare-border" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-healthcare-neutral/20 text-healthcare-text-muted flex items-center justify-center font-bold text-sm">3</div>
              <span className="text-xs sm:text-sm font-medium text-healthcare-text-muted hidden xs:inline">
                {isFreeAssessment ? 'Confirm' : 'Payment'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Free Assessment Banner */}
            {freeAssessmentEligible && !isFreeAssessment && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-green-800 mb-1">You're eligible for a Free Assessment!</h3>
                  <p className="text-sm text-green-700 mb-3">
                    As a new member, you can book a complimentary 50-minute assessment session at no cost.
                  </p>
                  <button
                    onClick={() => { setIsFreeAssessment(true); setSelectedPackage('free_assessment'); }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                  >
                    Use Free Assessment
                  </button>
                </div>
              </div>
            )}

            {isFreeAssessment && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-green-800">Free Assessment Selected</p>
                  <p className="text-sm text-green-700">Complimentary 50-minute assessment session</p>
                </div>
                <button
                  onClick={() => { setIsFreeAssessment(false); setSelectedPackage('single'); }}
                  className="text-sm text-green-700 font-semibold underline hover:text-green-900"
                >
                  Switch to paid
                </button>
              </div>
            )}

            {/* Step 1: Package Selection */}
            {!isFreeAssessment && (
              <section className="bg-white rounded-lg border border-healthcare-border p-6">
                <h2 className="text-2xl font-bold text-healthcare-text mb-2">Step 1: Select Package</h2>
                <p className="text-sm text-healthcare-text-muted mb-6">Choose the package that works best for you</p>

                <div className="space-y-4">
                  {PACKAGES.map((pkg) => (
                    <label
                      key={pkg.id}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedPackage === pkg.id
                          ? 'border-brand-blue bg-brand-blue/5'
                          : 'border-healthcare-border hover:border-brand-blue/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="package"
                          value={pkg.id}
                          checked={selectedPackage === pkg.id}
                          onChange={(e) => setSelectedPackage(e.target.value)}
                          className="w-5 h-5 text-brand-blue focus:ring-brand-blue"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-lg font-bold text-healthcare-text">{pkg.name}</h3>
                            <p className="text-xl font-bold text-healthcare-text">
                              ₹{pkg.price}
                              {pkg.id !== 'single' && (
                                <span className="text-sm text-healthcare-text-muted font-normal">/month</span>
                              )}
                            </p>
                          </div>
                          <p className="text-sm text-healthcare-text-muted">{pkg.description}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            )}

            {/* Step 2: Date & Time Selection */}
            <section className="bg-white rounded-lg border border-healthcare-border p-6">
              <h2 className="text-2xl font-bold text-healthcare-text mb-2">
                {!isFreeAssessment ? 'Step 2:' : 'Step 1:'} Select Date
              </h2>
              <p className="text-sm text-healthcare-text-muted mb-6">
                Choose your preferred appointment date
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-6">
                {availableDates.map((date) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const isSelected = selectedDate === dateStr;
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = date.getDate();
                  const monthName = date.toLocaleDateString('en-US', { month: 'short' });

                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-brand-blue bg-brand-blue text-white'
                          : 'border-healthcare-border hover:border-brand-blue/50 bg-white text-healthcare-text'
                      }`}
                    >
                      <div className="text-xs font-semibold mb-1">{dayName}</div>
                      <div className="text-xl font-bold">{dayNum}</div>
                      <div className="text-xs">{monthName}</div>
                    </button>
                  );
                })}
              </div>

              {/* Time Slot Selection */}
              {selectedDate && (
                <div className="pt-6 border-t border-healthcare-border">
                  <h3 className="text-lg font-bold text-healthcare-text mb-4">Available Time Slots</h3>
                  {loadingSlots ? (
                    <div className="flex justify-center py-6">
                      <Spinner />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {availableSlots.map((time) => {
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                              isSelected
                                ? 'border-brand-blue bg-brand-blue text-white'
                                : 'border-healthcare-border hover:border-brand-blue/50 bg-white text-healthcare-text'
                            }`}
                          >
                            {formatTimeDisplay(time)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Summary Sidebar */}
          <div>
            <div className="bg-white rounded-lg border border-healthcare-border p-6 sticky top-8">
              <h3 className="text-xl font-bold text-healthcare-text mb-6">Booking Summary</h3>

              {/* Therapist Info */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-healthcare-border">
                <img
                  src={therapist.avatar_url || therapist.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(therapist.name)}&background=6c63ff&color=fff`}
                  alt={therapist.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-bold text-healthcare-text mb-1">{therapist.name}</h4>
                  <p className="text-sm text-healthcare-text-muted">
                    {(therapist.specializations || [])[0] || therapist.specialization || 'Therapist'}
                  </p>
                </div>
              </div>

              {/* Selected Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-healthcare-text-muted mb-1">Package</p>
                  <p className="font-semibold text-healthcare-text">{selectedPkg?.name}</p>
                </div>
                {selectedDate && (
                  <div>
                    <p className="text-sm text-healthcare-text-muted mb-1">Date</p>
                    <p className="font-semibold text-healthcare-text">
                      {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                {selectedTime && (
                  <div>
                    <p className="text-sm text-healthcare-text-muted mb-1">Time</p>
                    <p className="font-semibold text-healthcare-text">{formatTimeDisplay(selectedTime)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-healthcare-text-muted mb-1">Duration</p>
                  <p className="font-semibold text-healthcare-text">50 minutes</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-6 border-t border-healthcare-border mb-6">
                {isFreeAssessment ? (
                  <div className="text-center py-2">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-healthcare-text-muted line-through text-lg">₹1,999</span>
                      <span className="text-2xl font-bold text-green-600">₹0</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-green-700 bg-green-50 py-1 rounded-md">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-wider">Free Assessment Claimed</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-healthcare-text-muted">Consultation Fee</span>
                      <span className="font-semibold text-healthcare-text">₹{selectedPkg?.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-healthcare-text-muted">GST (18%)</span>
                      <span className="font-semibold text-healthcare-text">
                        ₹{Math.round((selectedPkg?.price || 0) * 0.18)}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-healthcare-border flex justify-between items-center">
                      <span className="text-lg font-bold text-healthcare-text">Total Amount</span>
                      <span className="text-2xl font-bold text-brand-blue">₹{totalAmount}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Proceed Button */}
              <button
                onClick={handleProceedToCheckout}
                disabled={!canProceed}
                className="w-full py-3 bg-brand-blue text-white rounded-lg font-bold hover:bg-healthcare-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFreeAssessment ? 'Confirm Free Assessment' : 'Proceed to Payment'}
              </button>

              {/* Policy Note */}
              <p className="text-xs text-healthcare-text-muted mt-4 text-center">
                By proceeding, you agree to our{' '}
                <Link to="/terms" className="text-brand-blue hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-brand-blue hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
