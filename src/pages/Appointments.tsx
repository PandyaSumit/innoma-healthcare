import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UPCOMING_APPOINTMENTS, PAST_APPOINTMENTS } from '../data/appointments';
import type { Appointment } from '../data/appointments';
import AppointmentCard from '../components/AppointmentCard';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const appointments = activeTab === 'upcoming' ? UPCOMING_APPOINTMENTS : PAST_APPOINTMENTS;

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const handleCancel = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-healthcare-text mb-2">My Appointments</h1>
        <p className="text-healthcare-text-muted">Manage your therapy sessions and view appointment history</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-healthcare-border">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-3 font-semibold transition-colors relative ${
            activeTab === 'upcoming'
              ? 'text-brand-blue'
              : 'text-healthcare-text-muted hover:text-healthcare-text'
          }`}
        >
          Upcoming
          {activeTab === 'upcoming' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-6 py-3 font-semibold transition-colors relative ${
            activeTab === 'past'
              ? 'text-brand-blue'
              : 'text-healthcare-text-muted hover:text-healthcare-text'
          }`}
        >
          Past
          {activeTab === 'past' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" />}
        </button>
      </div>

      {/* Appointments List */}
      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onReschedule={handleReschedule}
              onCancel={handleCancel}
              isPast={activeTab === 'past'}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-healthcare-border p-12 text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-healthcare-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-xl font-bold text-healthcare-text mb-2">No appointments found</h3>
          <p className="text-healthcare-text-muted mb-6">
            {activeTab === 'upcoming'
              ? 'You have no upcoming appointments. Book your first session today!'
              : 'No past appointments to show.'}
          </p>
          {activeTab === 'upcoming' && (
            <Link
              to="/therapists"
              className="inline-block px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-healthcare-text transition-colors no-underline"
            >
              Find a Therapist
            </Link>
          )}
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <RescheduleModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowRescheduleModal(false);
            setSelectedAppointment(null);
          }}
        />
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedAppointment && (
        <CancelModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedAppointment(null);
          }}
        />
      )}
    </div>
  );
};



// Reschedule Modal
const RescheduleModal = ({
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

// Cancel Modal
const CancelModal = ({ appointment, onClose }: { appointment: Appointment; onClose: () => void }) => {
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

export default Appointments;
