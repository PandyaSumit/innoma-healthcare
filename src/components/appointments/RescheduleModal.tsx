import { useState } from "react";
import type { Appointment } from "../../data/appointments";
import { rescheduleAppointment } from "../../api/appointment.api";

export const RescheduleModal = ({
  appointment,
  onClose,
  onSuccess,
}: {
  appointment: Appointment;
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date;
  });

  const availableTimeSlots = [
    { display: "09:00 AM", value: "09:00" },
    { display: "10:00 AM", value: "10:00" },
    { display: "11:00 AM", value: "11:00" },
    { display: "02:00 PM", value: "14:00" },
    { display: "03:00 PM", value: "15:00" },
    { display: "04:00 PM", value: "16:00" },
    { display: "05:00 PM", value: "17:00" },
  ];

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;
    setIsLoading(true);
    setError(null);
    try {
      await rescheduleAppointment(appointment.id, selectedDate, selectedTime);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Reschedule failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      {/* Modal */}
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-[12px] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-healthcare-border shrink-0">
          <h2 className="text-xl font-semibold text-healthcare-text">Reschedule appointment</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-healthcare-surface transition cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto min-h-0">
          {/* Therapist Card */}
          <div className="flex items-center gap-4 rounded-[10px] bg-gradient-to-br from-white to-healthcare-surface border border-healthcare-border p-4">
            <img
              src={appointment.therapistPhoto}
              alt=""
              className="w-14 h-14 rounded-xl object-cover"
            />
            <div>
              <h3 className="font-semibold text-healthcare-text">{appointment.therapistName}</h3>
              <p className="text-sm text-healthcare-text-muted">{appointment.specialization}</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-[10px] border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Date Selection */}
          <div>
            <h3 className="text-sm font-semibold text-healthcare-text mb-3">Select new date</h3>
            <div className="grid grid-cols-4 gap-3">
              {availableDates.map((date) => {
                const dateStr = date.toISOString().split("T")[0];
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`rounded-[10px] border p-3 text-center transition ${
                      isSelected
                        ? "border-brand-blue bg-brand-blue text-white"
                        : "border-healthcare-border hover:border-brand-blue/50 hover:bg-healthcare-surface"
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className="text-lg font-semibold">{date.getDate()}</div>
                    <div className="text-xs">
                      {date.toLocaleDateString("en-US", { month: "short" })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div>
              <h3 className="text-sm font-semibold text-healthcare-text mb-3">Select time slot</h3>
              <div className="grid grid-cols-3 gap-3">
                {availableTimeSlots.map((slot) => {
                  const isSelected = selectedTime === slot.value;
                  return (
                    <button
                      key={slot.value}
                      onClick={() => setSelectedTime(slot.value)}
                      className={`rounded-[10px] border py-3 text-sm font-semibold transition ${
                        isSelected
                          ? "border-brand-blue bg-brand-blue text-white"
                          : "border-healthcare-border hover:border-brand-blue/50 hover:bg-healthcare-surface"
                      }`}
                    >
                      {slot.display}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Note */}
          <div className="rounded-[10px] border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800 leading-relaxed">
              <span className="font-semibold block mb-1">Note</span>
              You have {appointment.reschedulesLeft} reschedule(s) remaining.
              Rescheduling must be done at least 24 hours before the session.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-5 border-t border-healthcare-border bg-white shrink-0">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-[10px] border border-healthcare-border py-3 text-sm font-semibold text-healthcare-text hover:bg-healthcare-surface transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime || isLoading}
            className="flex-1 rounded-[10px] bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-healthcare-text transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {isLoading ? 'Rescheduling...' : 'Confirm reschedule'}
          </button>
        </div>
      </div>
    </div>
  );
};
