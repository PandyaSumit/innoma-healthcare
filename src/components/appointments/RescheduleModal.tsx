import { useState } from 'react';
import type { Appointment } from '../../data/appointments';

export const RescheduleModal = ({
  appointment,
  onClose,
}: {
  appointment: Appointment;
  onClose: () => void;
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Generate next 14 days
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date;
  });

  const availableTimeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

  const handleConfirm = () => {
    // Mock reschedule
    alert(`Rescheduled to ${selectedDate} at ${selectedTime}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-healthcare-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-healthcare-text">Reschedule Appointment</h2>
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
              <p className="text-sm text-healthcare-text-muted">{appointment.specialization}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-healthcare-text mb-4">Select New Date</h3>
            <div className="grid grid-cols-4 gap-3">
              {availableDates.map((date) => {
                const dateStr = date.toISOString().split('T')[0];
                const isSelected = selectedDate === dateStr;
                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-brand-blue bg-brand-blue text-white'
                        : 'border-healthcare-border hover:border-brand-blue/50'
                    }`}
                  >
                    <div className="text-xs font-semibold mb-1">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-xl font-bold">{date.getDate()}</div>
                    <div className="text-xs">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <div>
              <h3 className="text-lg font-bold text-healthcare-text mb-4">Select Time Slot</h3>
              <div className="grid grid-cols-3 gap-3">
                {availableTimeSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                        isSelected
                          ? 'border-brand-blue bg-brand-blue text-white'
                          : 'border-healthcare-border hover:border-brand-blue/50'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> You have {appointment.reschedulesLeft} reschedule(s) remaining for this
              appointment. Rescheduling must be done at least 24 hours before the session.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-healthcare-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-healthcare-border text-healthcare-text rounded-lg font-semibold hover:bg-healthcare-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
            className="flex-1 px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-healthcare-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};
