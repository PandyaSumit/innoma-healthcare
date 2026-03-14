import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { createAppointment } from '../api/appointment.api';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    therapist,
    package: pkg,
    date,
    time,        // 24h format for API (e.g. "14:00")
    timeDisplay, // 12h format for display (e.g. "2:00 PM")
    therapistId,
    isFreeAssessment,
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayTime = timeDisplay || time;

  if (!therapist || !date || !time) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-healthcare-text mb-4">Invalid booking details</h2>
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

  const subtotal = isFreeAssessment ? 0 : (pkg?.price ?? 0);
  const gst = isFreeAssessment ? 0 : Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  // ─── Free Assessment Booking ────────────────────────────────────────────────
  const handleBookFreeAssessment = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const appointment = await createAppointment({
        therapistId: therapistId || therapist.id,
        packageId: 'free_assessment',
        scheduledDate: date,
        scheduledTime: time,
        type: 'Assessment',
        isFreeAssessment: true,
      });

      navigate('/confirmation', {
        state: {
          therapist,
          package: { id: 'free_assessment', name: 'Free Assessment', price: 0 },
          date,
          time: displayTime,
          appointmentId: appointment.id,
          meetingLink: appointment.meeting_link ?? null,
          invoiceNumber: appointment.invoice_number ?? `INN-${Date.now()}`,
          total: 0,
          isFreeAssessment: true,
        },
      });
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Booking failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Paid Session Booking ────────────────────────────────────────────────────
  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      // ── RAZORPAY INTEGRATION (disabled — uncomment when activating) ──────────
      //
      // Step 1: Create Razorpay order on backend
      // const { data: orderData } = await api.post('/payments/create-order', {
      //   amount: total * 100, // paise
      //   currency: 'INR',
      //   receipt: `receipt_${Date.now()}`,
      // });
      //
      // Step 2: Open Razorpay checkout modal
      // const razorpayOptions = {
      //   key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      //   amount: orderData.data.amount,
      //   currency: orderData.data.currency,
      //   name: 'Innoma Healthcare',
      //   description: `Session with ${therapist.name}`,
      //   order_id: orderData.data.id,
      //   handler: async (response: any) => {
      //     // Step 3: Create appointment with Razorpay payment IDs
      //     const appointment = await createAppointment({
      //       therapistId: therapistId || therapist.id,
      //       packageId: pkg.id,
      //       scheduledDate: date,
      //       scheduledTime: time,
      //       isFreeAssessment: false,
      //       razorpayOrderId: response.razorpay_order_id,
      //       razorpayPaymentId: response.razorpay_payment_id,
      //       razorpaySignature: response.razorpay_signature,
      //     });
      //     navigate('/confirmation', {
      //       state: {
      //         therapist, package: pkg, date, time: displayTime,
      //         appointmentId: appointment.id,
      //         meetingLink: appointment.meeting_link ?? null,
      //         invoiceNumber: appointment.invoice_number,
      //         total,
      //         paymentMethod,
      //       },
      //     });
      //   },
      //   prefill: { name: user?.name, email: user?.email },
      //   theme: { color: '#1D4ED8' },
      // };
      // const rzp = new (window as any).Razorpay(razorpayOptions);
      // rzp.open();
      // return; // handler above will navigate
      //
      // ── END RAZORPAY INTEGRATION ─────────────────────────────────────────────

      // Mock payment flow (used while Razorpay is disabled)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const appointment = await createAppointment({
        therapistId: therapistId || therapist.id,
        packageId: pkg?.id || 'single',
        scheduledDate: date,
        scheduledTime: time,
        isFreeAssessment: false,
      });

      navigate('/confirmation', {
        state: {
          therapist,
          package: pkg,
          date,
          time: displayTime,
          appointmentId: appointment.id,
          meetingLink: appointment.meeting_link ?? null,
          invoiceNumber: appointment.invoice_number ?? `INN-${Date.now()}`,
          total,
          paymentMethod,
        },
      });
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
        <h1 className="text-2xl sm:text-3xl font-bold text-healthcare-text">
          {isFreeAssessment ? 'Book Free Assessment' : 'Complete Payment'}
        </h1>
        {!isFreeAssessment && (
          <p className="text-healthcare-text-muted mt-1">Secure payment powered by Razorpay</p>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div>
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-healthcare-text hidden xs:inline">
                {isFreeAssessment ? 'Free Session' : 'Select Package'}
              </span>
            </div>
            <div className="h-px w-8 sm:w-16 bg-green-500" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-healthcare-text hidden xs:inline">Date & Time</span>
            </div>
            <div className="h-px w-8 sm:w-16 bg-brand-blue" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <span className="text-xs sm:text-sm font-semibold text-healthcare-text hidden xs:inline">
                {isFreeAssessment ? 'Confirm' : 'Payment'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-2 space-y-6">
            {isFreeAssessment ? (
              /* Free Assessment Panel */
              <div className="bg-white rounded-lg border border-healthcare-border p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-healthcare-text mb-1">Free Assessment Session</h2>
                    <p className="text-healthcare-text-muted text-sm">
                      You are eligible for a complimentary 50-minute assessment session at no cost.
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-green-800">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">No payment required</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-800">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">50-minute one-on-one video session</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-800">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Can be cancelled up to 24 hours before</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-800">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Meeting link sent to your email after booking</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-800">
                    <strong>Note:</strong> Each account is eligible for one free assessment session. This session
                    cannot be transferred or reused once completed.
                  </p>
                </div>
              </div>
            ) : (
              /* Paid Payment Panel */
              <>
                {/* Payment Method Selection */}
                <div className="bg-white rounded-lg border border-healthcare-border p-6">
                  <h2 className="text-2xl font-bold text-healthcare-text mb-6">Select Payment Method</h2>
                  <div className="space-y-3">
                    {[
                      { id: 'card', name: 'Credit / Debit Card', icon: '💳' },
                      { id: 'upi', name: 'UPI', icon: '📱' },
                      { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
                      { id: 'wallet', name: 'Digital Wallet', icon: '💰' },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? 'border-brand-blue bg-brand-blue/5'
                            : 'border-healthcare-border hover:border-brand-blue/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-5 h-5 text-brand-blue focus:ring-brand-blue"
                        />
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-semibold text-healthcare-text">{method.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mock Card Form */}
                {paymentMethod === 'card' && (
                  <div className="bg-white rounded-lg border border-healthcare-border p-6">
                    <h3 className="text-lg font-bold text-healthcare-text mb-4">Card Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-healthcare-text mb-2">Card Number</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-healthcare-text mb-2">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-healthcare-text mb-2">CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-3 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-healthcare-text mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="bg-white rounded-lg border border-healthcare-border p-6">
                    <h3 className="text-lg font-bold text-healthcare-text mb-4">UPI ID</h3>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      className="w-full px-4 py-3 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none"
                    />
                  </div>
                )}

                {/* Security Badge */}
                <div className="bg-healthcare-lavender/20 rounded-lg border border-healthcare-lavender/30 p-4 flex items-center gap-3">
                  <svg className="w-8 h-8 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-healthcare-text">Secure Payment</p>
                    <p className="text-sm text-healthcare-text-muted">Your payment information is encrypted and secure</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg border border-healthcare-border p-6 sticky top-8">
              <h3 className="text-xl font-bold text-healthcare-text mb-6">Order Summary</h3>

              {/* Therapist Info */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-healthcare-border">
                <img
                  src={therapist.photo || therapist.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(therapist.name)}&background=random`}
                  alt={therapist.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-bold text-healthcare-text mb-1">{therapist.name}</h4>
                  <p className="text-sm text-healthcare-text-muted">
                    {therapist.specializations?.[0] || therapist.specialization || 'Therapist'}
                  </p>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-sm text-healthcare-text-muted">Package</p>
                  <p className="font-semibold text-healthcare-text">
                    {isFreeAssessment ? 'Free Assessment (50 min)' : pkg?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-healthcare-text-muted">Date & Time</p>
                  <p className="font-semibold text-healthcare-text">
                    {new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    at {displayTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-healthcare-text-muted">Duration</p>
                  <p className="font-semibold text-healthcare-text">50 minutes</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-6 border-t border-healthcare-border space-y-3 mb-6">
                {isFreeAssessment ? (
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-healthcare-text">Total</span>
                    <span className="text-2xl font-bold text-green-600">FREE</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-healthcare-text-muted">Subtotal</span>
                      <span className="font-semibold text-healthcare-text">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-healthcare-text-muted">GST (18%)</span>
                      <span className="font-semibold text-healthcare-text">₹{gst}</span>
                    </div>
                    <div className="pt-3 border-t border-healthcare-border flex justify-between items-center">
                      <span className="text-lg font-bold text-healthcare-text">Total</span>
                      <span className="text-2xl font-bold text-brand-blue">₹{total}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Action Button */}
              {isFreeAssessment ? (
                <button
                  onClick={handleBookFreeAssessment}
                  disabled={isProcessing}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Booking...' : 'Book Free Session'}
                </button>
              ) : (
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-3 bg-brand-blue text-white rounded-lg font-bold hover:bg-healthcare-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : `Pay ₹${total}`}
                </button>
              )}

              {/* Cancellation Policy */}
              <div className="mt-6 p-4 bg-healthcare-surface rounded-lg">
                <p className="text-xs text-healthcare-text-muted">
                  <strong>Cancellation Policy:</strong>{' '}
                  {isFreeAssessment
                    ? 'Free sessions can be cancelled up to 24 hours before the scheduled time.'
                    : 'Cancel up to 48 hours before for a full refund. Cancel within 24–48 hours for a 50% refund.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
