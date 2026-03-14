import { useState } from "react";
import type { Appointment } from "../../data/appointments";
import { cancelAppointment } from "../../api/appointment.api";

export const CancelModal = ({
  appointment,
  onClose,
  onSuccess,
  isTherapist = false,
}: {
  appointment: Appointment;
  onClose: () => void;
  onSuccess?: () => void;
  isTherapist?: boolean;
}) => {
  const [cancelReason, setCancelReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refundInfo, setRefundInfo] = useState<{ refundPercent: number } | null>(null);

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cancelAppointment(appointment.id, cancelReason || undefined);
      setRefundInfo(result);
      // Brief pause to show refund info, then close
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Cancellation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fade-in">
      {/* Modal wrapper */}
      <div
        className="
          w-full max-w-md
          bg-white shadow-2xl
          rounded-[16px]
          overflow-hidden
          max-h-[90vh]
          flex flex-col
          border border-healthcare-border
        "
      >
        {/* Header (fixed) */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-healthcare-border shrink-0 bg-gray-50/50">
          <h2 className="text-xl font-bold text-healthcare-text">Cancel Session</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-healthcare-surface transition cursor-pointer text-healthcare-text-muted hover:text-healthcare-text disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="p-6 space-y-6 overflow-y-auto min-h-0">
          {/* Card: Show Patient for Therapist, Therapist for Patient */}
          <div className="flex items-center gap-4 rounded-[10px] bg-gradient-to-br from-white to-healthcare-surface border border-healthcare-border p-4">
            <img
              src={
                isTherapist
                  ? appointment.patientPhoto || "https://ui-avatars.com/api/?background=random"
                  : appointment.therapistPhoto
              }
              alt=""
              className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100"
            />
            <div>
              <h3 className="font-bold text-healthcare-text text-lg">
                {isTherapist ? appointment.patientName : appointment.therapistName}
              </h3>
              <p className="text-sm text-healthcare-text-muted font-medium">
                {new Date(appointment.date).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}{" "}
                · {appointment.time}
              </p>
            </div>
          </div>

          {/* Cancellation policy */}
          <div className={`rounded-[12px] border p-4 ${isTherapist ? "bg-orange-50 border-orange-200" : "bg-red-50 border-red-200"}`}>
            <p className={`text-sm leading-relaxed ${isTherapist ? "text-orange-800" : "text-red-800"}`}>
              <span className="font-bold block mb-1">
                {isTherapist ? "Cancellation Note" : "Cancellation Policy"}
              </span>
              {isTherapist ? (
                "This will notify the patient immediately. If cancelling less than 24 hours before, please ensure you have communicated with them personally if possible."
              ) : appointment.fee === 0 ? (
                "Free assessment sessions can be cancelled up to 24 hours before. Your free assessment eligibility will be restored."
              ) : (
                <>
                  • 48+ hours before: Full refund <br />
                  • 24–48 hours before: 50% refund <br />
                  • Less than 24 hours: No refund
                </>
              )}
            </p>
          </div>

          {/* Success / Refund info */}
          {refundInfo && (
            <div className="rounded-[12px] border border-green-200 bg-green-50 p-4">
              <p className="text-sm text-green-800 font-medium">
                {refundInfo.refundPercent > 0
                  ? `Appointment cancelled. You will receive a ${refundInfo.refundPercent}% refund.`
                  : 'Appointment cancelled. No refund applicable.'}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-[12px] border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Reason */}
          {!refundInfo && (
            <div>
              <label className="block text-sm font-bold text-healthcare-text mb-2">
                Reason for cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                placeholder="Tell us why you're cancelling..."
                className="w-full rounded-[10px] border border-healthcare-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue resize-none"
              />
            </div>
          )}
        </div>

        {/* Footer (fixed) */}
        {!refundInfo && (
          <div className="flex gap-3 px-6 py-5 border-t border-healthcare-border bg-white shrink-0">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-[10px] border border-healthcare-border py-3 text-sm font-semibold text-healthcare-text hover:bg-healthcare-surface transition cursor-pointer disabled:opacity-50"
            >
              Keep appointment
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 rounded-[10px] bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {isLoading ? 'Cancelling...' : 'Cancel appointment'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
