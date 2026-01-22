import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { therapist, package: pkg, date, time } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!therapist || !pkg || !date || !time) {
    return (
      <div className="min-h-screen bg-healthcare-surface flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-healthcare-text mb-4">Invalid booking details</h2>
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

  const subtotal = pkg.price;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);

    // Navigate to confirmation
    navigate('/confirmation', {
      state: {
        therapist,
        package: pkg,
        date,
        time,
        invoiceNumber: `INN-${Date.now()}`,
        paymentMethod,
        total,
      },
    });
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
          <h1 className="text-3xl font-bold text-healthcare-text">Complete Payment</h1>
          <p className="text-healthcare-text-muted mt-2">Secure payment powered by Razorpay</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-healthcare-text">Select Package</span>
            </div>
            <div className="h-px w-16 bg-green-500" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-healthcare-text">Choose Date & Time</span>
            </div>
            <div className="h-px w-16 bg-brand-blue" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">
                3
              </div>
              <span className="text-sm font-semibold text-healthcare-text">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
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

            {/* Mock Payment Form */}
            {paymentMethod === 'card' && (
              <div className="bg-white rounded-lg border border-healthcare-border p-6">
                <h3 className="text-lg font-bold text-healthcare-text mb-4">Card Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-healthcare-text mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-healthcare-text mb-2">
                        Expiry Date
                      </label>
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
                    <label className="block text-sm font-semibold text-healthcare-text mb-2">
                      Cardholder Name
                    </label>
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <div>
                <p className="font-semibold text-healthcare-text">Secure Payment</p>
                <p className="text-sm text-healthcare-text-muted">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg border border-healthcare-border p-6 sticky top-8">
              <h3 className="text-xl font-bold text-healthcare-text mb-6">Order Summary</h3>

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

              {/* Booking Details */}
              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-sm text-healthcare-text-muted">Package</p>
                  <p className="font-semibold text-healthcare-text">{pkg.name}</p>
                </div>
                <div>
                  <p className="text-sm text-healthcare-text-muted">Date & Time</p>
                  <p className="font-semibold text-healthcare-text">
                    {new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    at {time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-healthcare-text-muted">Duration</p>
                  <p className="font-semibold text-healthcare-text">50 minutes</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-6 border-t border-healthcare-border space-y-3 mb-6">
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
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-3 bg-brand-blue text-white rounded-lg font-bold hover:bg-healthcare-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Pay ₹${total}`}
              </button>

              {/* Refund Policy */}
              <div className="mt-6 p-4 bg-healthcare-surface rounded-lg">
                <p className="text-xs text-healthcare-text-muted">
                  <strong>Cancellation Policy:</strong> Cancel up to 48 hours before for a full refund.
                  Cancel within 24-48 hours for a 50% refund.
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
