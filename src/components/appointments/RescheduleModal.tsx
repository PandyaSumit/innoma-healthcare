import { useState } from "react";
import type { Appointment } from "../../data/appointments";

export const RescheduleModal = ({
  appointment,
  onClose,
}: {
  appointment: Appointment;
  onClose: () => void;
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date;
  });

  const availableTimeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const handleConfirm = () => {
    alert(`Rescheduled to ${selectedDate} at ${selectedTime}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      {/* Modal */}
      <div
        className="
          w-full max-w-2xl
          bg-white shadow-2xl
          rounded-[12px]
          overflow-hidden
          max-h-[90vh]
          flex flex-col
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-healthcare-border shrink-0">
          <h2 className="text-xl font-semibold text-healthcare-text">
            Reschedule appointment
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-healthcare-surface transition cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto min-h-0">
          {/* Therapist Card */}
          <div
            className="
              flex items-center gap-4
              rounded-[10px]
              bg-gradient-to-br from-white to-healthcare-surface
              border border-healthcare-border
              p-4
            "
          >
            <img
              src={appointment.therapistPhoto}
              alt=""
              className="w-14 h-14 rounded-xl object-cover"
            />
            <div>
              <h3 className="font-semibold text-healthcare-text">
                {appointment.therapistName}
              </h3>
              <p className="text-sm text-healthcare-text-muted">
                {appointment.specialization}
              </p>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <h3 className="text-sm font-semibold text-healthcare-text mb-3">
              Select new date
            </h3>

            <div className="grid grid-cols-4 gap-3">
              {availableDates.map((date) => {
                const dateStr = date.toISOString().split("T")[0];
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`
                      rounded-[10px] border p-3 text-center transition
                      ${
                        isSelected
                          ? "border-brand-blue bg-brand-blue text-white"
                          : "border-healthcare-border hover:border-brand-blue/50 hover:bg-healthcare-surface"
                      }
                    `}
                  >
                    <div className="text-xs font-medium mb-1">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className="text-lg font-semibold">
                      {date.getDate()}
                    </div>
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
              <h3 className="text-sm font-semibold text-healthcare-text mb-3">
                Select time slot
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {availableTimeSlots.map((time) => {
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`
                        rounded-[10px] border py-3 text-sm font-semibold transition
                        ${
                          isSelected
                            ? "border-brand-blue bg-brand-blue text-white"
                            : "border-healthcare-border hover:border-brand-blue/50 hover:bg-healthcare-surface"
                        }
                      `}
                    >
                      {time}
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
            className="
              flex-1 rounded-[10px]
              border border-healthcare-border
              py-3 text-sm font-semibold text-healthcare-text
              hover:bg-healthcare-surface transition cursor-pointer
            "
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
            className="
              flex-1 rounded-[10px] bg-brand-blue py-3
              text-sm font-semibold text-white
              hover:bg-healthcare-text transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Confirm reschedule
          </button>
        </div>
      </div>
    </div>
  );
};
