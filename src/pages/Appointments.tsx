import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UPCOMING_APPOINTMENTS, PAST_APPOINTMENTS } from '../data/appointments';
import type { Appointment } from '../data/appointments';
import AppointmentCard from '../components/AppointmentCard';
import { RescheduleModal } from '../components/appointments/RescheduleModal';
import { CancelModal } from '../components/appointments/CancelModal';

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
          className={`px-6 py-3 font-semibold transition-colors relative cursor-pointer  ${
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
          className={`px-6 py-3 font-semibold transition-colors relative cursor-pointer ${
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

export default Appointments;
