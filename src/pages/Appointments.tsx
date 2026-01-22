import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UPCOMING_APPOINTMENTS, PAST_APPOINTMENTS, Appointment } from '../data/appointments';

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
    <div className="p-6 md:p-10">
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

// Appointment Card Component
const AppointmentCard = ({
  appointment,
  onReschedule,
  onCancel,
  isPast,
}: {
  appointment: Appointment;
  onReschedule: (apt: Appointment) => void;
  onCancel: (apt: Appointment) => void;
  isPast: boolean;
}) => {
  const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const now = new Date();
  const timeDiff = appointmentDate.getTime() - now.getTime();
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
  const canJoin = minutesDiff <= 15 && minutesDiff >= 0;

  return (
    <div className="bg-white rounded-lg border border-healthcare-border p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Therapist Info */}
        <div className="flex gap-4 flex-1">
          <img
            src={appointment.therapistPhoto}
            alt={appointment.therapistName}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-healthcare-text mb-1">{appointment.therapistName}</h3>
            <p className="text-sm text-healthcare-text-muted mb-3">{appointment.specialization}</p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-healthcare-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-healthcare-text font-medium">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-healthcare-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-healthcare-text font-medium">{appointment.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-healthcare-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-healthcare-text font-medium">{appointment.duration} min</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="px-3 py-1 bg-healthcare-lavender/30 text-brand-blue text-xs font-semibold rounded-full">
                {appointment.type}
              </span>
              {appointment.fee === 0 && (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  Free Assessment
                </span>
              )}
              {isPast && appointment.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-healthcare-text-muted">Your rating:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3 h-3 ${i < appointment.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 lg:w-48">
          {!isPast ? (
            <>
              {canJoin ? (
                <Link
                  to={`/join/${appointment.id}`}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-center no-underline"
                >
                  Join Now
                </Link>
              ) : (
                <Link
                  to={`/join/${appointment.id}`}
                  className="px-6 py-2.5 bg-brand-blue text-white rounded-lg font-semibold hover:bg-healthcare-text transition-colors text-center no-underline"
                >
                  View Details
                </Link>
              )}
              <button
                onClick={() => onReschedule(appointment)}
                disabled={appointment.reschedulesLeft === 0}
                className="px-6 py-2.5 border-2 border-brand-blue text-brand-blue rounded-lg font-semibold hover:bg-brand-blue hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reschedule ({appointment.reschedulesLeft} left)
              </button>
              <button
                onClick={() => onCancel(appointment)}
                className="px-6 py-2.5 border border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <Link
                to={`/book/${appointment.therapistId}`}
                className="px-6 py-2.5 bg-brand-blue text-white rounded-lg font-semibold hover:bg-healthcare-text transition-colors text-center no-underline"
              >
                Book Again
              </Link>
              {appointment.sessionNotes && (
                <button className="px-6 py-2.5 border-2 border-healthcare-border text-healthcare-text rounded-lg font-semibold hover:bg-healthcare-surface transition-colors">
                  View Notes
                </button>
              )}
              {appointment.invoiceNumber && (
                <button className="px-6 py-2.5 border-2 border-healthcare-border text-healthcare-text rounded-lg font-semibold hover:bg-healthcare-surface transition-colors">
                  Download Invoice
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Session Notes Preview (Past) */}
      {isPast && appointment.sessionNotes && (
        <div className="mt-6 pt-6 border-t border-healthcare-border">
          <h4 className="text-sm font-bold text-healthcare-text mb-2">Session Notes</h4>
          <p className="text-sm text-healthcare-text-muted">{appointment.sessionNotes}</p>
        </div>
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
