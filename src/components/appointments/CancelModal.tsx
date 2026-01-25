import { useState } from 'react';
import type { Appointment } from '../../data/appointments';

export const CancelModal = ({ appointment, onClose }: { appointment: Appointment; onClose: () => void }) => {
  const [cancelReason, setCancelReason] = useState('');

  const handleConfirm = () => {
    // Mock cancellation
    alert(`Appointment cancelled. Reason: ${cancelReason || 'Not specified'}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-healthcare-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-healthcare-text">Cancel Appointment</h2>
            <button onClick={onClose} className="p-2 hover:bg-healthcare-surface rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-healthcare-surface rounded-lg">
            <img src={appointment.therapistPhoto} alt="" className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <h3 className="font-bold text-healthcare-text">{appointment.therapistName}</h3>
              <p className="text-sm text-healthcare-text-muted">
                {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Cancellation Policy:</strong>
              <br />• Cancel 48+ hours before: Full refund
              <br />• Cancel 24-48 hours before: 50% refund
              <br />• Cancel &lt;24 hours before: No refund
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-healthcare-text mb-2">
              Reason for Cancellation (Optional)
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Help us improve our service..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-healthcare-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-healthcare-border text-healthcare-text rounded-lg font-semibold hover:bg-healthcare-surface transition-colors"
          >
            Keep Appointment
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Cancel Appointment
          </button>
        </div>
      </div>
    </div>
  );
};
