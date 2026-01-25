import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Appointment } from '../data/appointments';
import { useAppointments } from '../context/AppointmentContext';
import { useToast } from '../context/ToastContext';
import AppointmentCard from '../components/AppointmentCard';

const Appointments = () => {
  const { upcomingAppointments, pastAppointments, cancelAppointment, rescheduleAppointment } = useAppointments();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const appointments = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const handleCancel = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  return (
    <div className="pb-20 md:pb-0">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-healthcare-text mb-2">My Appointments</h1>
        <p className="text-sm md:text-base text-healthcare-text-muted">Manage your therapy sessions and view appointment history</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-healthcare-border">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 md:px-6 py-3 font-semibold transition-colors relative text-sm md:text-base ${
            activeTab === 'upcoming'
              ? 'text-brand-blue'
              : 'text-healthcare-text-muted hover:text-healthcare-text'
          }`}
        >
          Upcoming
          {upcomingAppointments.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-brand-blue/10 text-brand-blue rounded-full">
              {upcomingAppointments.length}
            </span>
          )}
          {activeTab === 'upcoming' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 md:px-6 py-3 font-semibold transition-colors relative text-sm md:text-base ${
            activeTab === 'past'
              ? 'text-brand-blue'
              : 'text-healthcare-text-muted hover:text-healthcare-text'
          }`}
        >
          Past
          {pastAppointments.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-healthcare-text-muted rounded-full">
              {pastAppointments.length}
            </span>
          )}
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
        <div className="bg-white rounded-2xl border border-healthcare-border p-8 md:p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-healthcare-surface rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-healthcare-text-muted"
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
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-healthcare-text mb-2">
            {activeTab === 'upcoming' ? 'No Upcoming Appointments' : 'No Past Appointments'}
          </h3>
          <p className="text-healthcare-text-muted mb-6 max-w-md mx-auto">
            {activeTab === 'upcoming'
              ? "You don't have any upcoming sessions. Book your first therapy session to start your mental wellness journey!"
              : 'Your appointment history will appear here once you complete sessions.'}
          </p>
          {activeTab === 'upcoming' && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/assessment"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-full font-semibold hover:bg-brand-orange/90 transition-colors no-underline shadow-lg shadow-brand-orange/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Free Assessment
              </Link>
              <Link
                to="/therapists"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-full font-semibold hover:bg-brand-blue/90 transition-colors no-underline shadow-lg shadow-brand-blue/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Browse Therapists
              </Link>
            </div>
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
          onConfirm={(date, time) => {
            rescheduleAppointment(selectedAppointment.id, date, time);
            showToast({ type: 'success', title: 'Appointment rescheduled successfully!' });
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
          onConfirm={() => {
            cancelAppointment(selectedAppointment.id);
            showToast({ type: 'info', title: 'Appointment cancelled successfully' });
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
  onConfirm,
}: {
  appointment: Appointment;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
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
    onConfirm(selectedDate, selectedTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6 border-b border-healthcare-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-healthcare-text">Reschedule Appointment</h2>
            <button onClick={onClose} className="p-2 hover:bg-healthcare-surface rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-healthcare-surface rounded-xl">
            <img src={appointment.therapistPhoto} alt="" className="w-14 h-14 md:w-16 md:h-16 rounded-lg object-cover" />
            <div>
              <h3 className="font-bold text-healthcare-text">{appointment.therapistName}</h3>
              <p className="text-sm text-healthcare-text-muted">{appointment.specialization}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-healthcare-text mb-4">Select New Date</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 md:gap-3">
              {availableDates.map((date) => {
                const dateStr = date.toISOString().split('T')[0];
                const isSelected = selectedDate === dateStr;
                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`p-2 md:p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-brand-blue bg-brand-blue text-white'
                        : 'border-healthcare-border hover:border-brand-blue/50'
                    }`}
                  >
                    <div className="text-[10px] md:text-xs font-semibold mb-0.5 md:mb-1">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-lg md:text-xl font-bold">{date.getDate()}</div>
                    <div className="text-[10px] md:text-xs">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <div>
              <h3 className="text-lg font-bold text-healthcare-text mb-4">Select Time Slot</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                {availableTimeSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2.5 md:p-3 rounded-lg border-2 font-semibold text-sm transition-all ${
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

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> You have {appointment.reschedulesLeft || 2} reschedule(s) remaining for this
              appointment. Rescheduling must be done at least 24 hours before the session.
            </p>
          </div>
        </div>

        <div className="p-4 md:p-6 border-t border-healthcare-border flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-healthcare-border text-healthcare-text rounded-xl font-semibold hover:bg-healthcare-surface transition-colors order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
            className="flex-1 px-6 py-3 bg-brand-blue text-white rounded-xl font-semibold hover:bg-brand-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
          >
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};

// Cancel Modal
const CancelModal = ({
  appointment,
  onClose,
  onConfirm,
}: {
  appointment: Appointment;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const [cancelReason, setCancelReason] = useState('');

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-4 md:p-6 border-b border-healthcare-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-healthcare-text">Cancel Appointment</h2>
            <button onClick={onClose} className="p-2 hover:bg-healthcare-surface rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-healthcare-surface rounded-xl">
            <img src={appointment.therapistPhoto} alt="" className="w-14 h-14 md:w-16 md:h-16 rounded-lg object-cover" />
            <div>
              <h3 className="font-bold text-healthcare-text">{appointment.therapistName}</h3>
              <p className="text-sm text-healthcare-text-muted">
                {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {appointment.time}
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
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
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-healthcare-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none resize-none"
            />
          </div>
        </div>

        <div className="p-4 md:p-6 border-t border-healthcare-border flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-healthcare-border text-healthcare-text rounded-xl font-semibold hover:bg-healthcare-surface transition-colors order-2 sm:order-1"
          >
            Keep Appointment
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors order-1 sm:order-2"
          >
            Cancel Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
