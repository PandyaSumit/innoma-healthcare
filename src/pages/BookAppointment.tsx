import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { THERAPISTS } from '../data/therapists';

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

const BookAppointment = () => {
  const { therapistId } = useParams<{ therapistId: string }>();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState('single');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const therapist = THERAPISTS.find((t) => t.id === therapistId);

  if (!therapist) {
    return (
      <div className="min-h-screen bg-healthcare-surface flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-healthcare-text mb-4">Therapist not found</h2>
          <Link
            to="/therapists"
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

  // Mock time slots
  const availableTimeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  const selectedPkg = PACKAGES.find((p) => p.id === selectedPackage);
  const canProceed = selectedDate && selectedTime;

  const handleProceedToCheckout = () => {
    if (canProceed) {
      navigate('/checkout', {
        state: {
          therapist,
          package: selectedPkg,
          date: selectedDate,
          time: selectedTime,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-healthcare-surface">
      {/* Header */}
      <div className="bg-white border-b border-healthcare-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-healthcare-text-muted hover:text-healthcare-text transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-healthcare-text">Book Appointment</h1>
          <p className="text-healthcare-text-muted mt-2">Complete the steps below to schedule your session</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">
                1
              </div>
              <span className="text-sm font-semibold text-healthcare-text">Select Package</span>
            </div>
            <div className="h-px w-16 bg-healthcare-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">
                2
              </div>
              <span className="text-sm font-semibold text-healthcare-text">Choose Date & Time</span>
            </div>
            <div className="h-px w-16 bg-healthcare-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-healthcare-neutral/20 text-healthcare-text-muted flex items-center justify-center font-bold">
                3
              </div>
              <span className="text-sm font-medium text-healthcare-text-muted">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Package Selection */}
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

            {/* Step 2: Date Selection */}
            <section className="bg-white rounded-lg border border-healthcare-border p-6">
              <h2 className="text-2xl font-bold text-healthcare-text mb-2">Step 2: Select Date</h2>
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {availableTimeSlots.map((time) => {
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
                          {time}
                        </button>
                      );
                    })}
                  </div>
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
                  src={therapist.photo}
                  alt={therapist.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-bold text-healthcare-text mb-1">{therapist.name}</h4>
                  <p className="text-sm text-healthcare-text-muted">{therapist.specializations[0]}</p>
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
                      {new Date(selectedDate).toLocaleDateString('en-US', {
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
                    <p className="font-semibold text-healthcare-text">{selectedTime}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-healthcare-text-muted mb-1">Duration</p>
                  <p className="font-semibold text-healthcare-text">50 minutes</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-6 border-t border-healthcare-border mb-6">
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
                </div>
                <div className="pt-4 border-t border-healthcare-border flex justify-between items-center">
                  <span className="text-lg font-bold text-healthcare-text">Total Amount</span>
                  <span className="text-2xl font-bold text-brand-blue">
                    ₹{Math.round((selectedPkg?.price || 0) * 1.18)}
                  </span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={handleProceedToCheckout}
                disabled={!canProceed}
                className="w-full py-3 bg-brand-blue text-white rounded-lg font-bold hover:bg-healthcare-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Payment
              </button>

              {/* Policy Note */}
              <p className="text-xs text-healthcare-text-muted mt-4 text-center">
                By proceeding, you agree to our{' '}
                <Link to="/terms" className="text-brand-blue hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-brand-blue hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
