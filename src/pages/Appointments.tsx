import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { UPCOMING_APPOINTMENTS, PAST_APPOINTMENTS } from "../data/appointments";
import type { Appointment } from "../data/appointments";
import AppointmentCard from "../components/AppointmentCard";
import TherapistAppointmentCard from "../components/appointments/TherapistAppointmentCard";
import PatientList from "../components/appointments/PatientList";
import { RescheduleModal } from "../components/appointments/RescheduleModal";
import { CancelModal } from "../components/appointments/CancelModal";

const Appointments = () => {
  const { user } = useAuth();
  const { bookedAppointments } = useBooking();
  const isTherapist = user?.role === "therapist";

  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");
  const validTabs = ["upcoming", "past", "patients"];
  const activeTab = validTabs.includes(tabParam || "")
    ? (tabParam as "upcoming" | "past" | "patients")
    : "upcoming";

  const setActiveTab = (tab: "upcoming" | "past" | "patients") => {
    setSearchParams({ tab });
  };

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Combine static appointments with dynamically booked ones
  const now = new Date();

  // For patient view
  const patientUpcoming = [
    ...UPCOMING_APPOINTMENTS.filter(apt => apt.patientId === 'patient-001'),
    ...bookedAppointments.filter(apt => {
      const aptDate = new Date(`${apt.date}T${apt.time}`);
      return aptDate >= now && apt.status === 'Upcoming';
    })
  ];

  const patientPast = [
    ...PAST_APPOINTMENTS.filter(apt => apt.patientId === 'patient-001'),
    ...bookedAppointments.filter(apt => {
      const aptDate = new Date(`${apt.date}T${apt.time}`);
      return aptDate < now || apt.status === 'Completed';
    })
  ];

  // For therapist view - show all appointments
  const therapistUpcoming = [
    ...UPCOMING_APPOINTMENTS,
    ...bookedAppointments.filter(apt => {
      const aptDate = new Date(`${apt.date}T${apt.time}`);
      return aptDate >= now && apt.status === 'Upcoming';
    })
  ];

  const therapistPast = [
    ...PAST_APPOINTMENTS,
    ...bookedAppointments.filter(apt => {
      const aptDate = new Date(`${apt.date}T${apt.time}`);
      return aptDate < now || apt.status === 'Completed';
    })
  ];

  const filteredUpcoming = isTherapist ? therapistUpcoming : patientUpcoming;
  const filteredPast = isTherapist ? therapistPast : patientPast;

  const currentList =
    activeTab === "upcoming" ? filteredUpcoming : filteredPast;

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const handleCancel = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleViewNotes = (appointment: Appointment) => {
    console.log("View notes for", appointment.id);
  };

  return (
    <div className="mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-healthcare-text mb-2">
          {isTherapist ? "Practice Management" : "My Sessions"}
        </h1>
        <p className="text-healthcare-text-muted">
          {isTherapist
            ? "Manage your sessions and patient records"
            : "View and manage your therapy sessions"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-healthcare-border overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-6 py-3 font-semibold transition-colors relative whitespace-nowrap cursor-pointer ${
            activeTab === "upcoming"
              ? "text-brand-blue"
              : "text-healthcare-text-muted hover:text-healthcare-text"
          }`}
        >
          {isTherapist ? "Upcoming Sessions" : "Upcoming"}
          {filteredUpcoming.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-xs font-bold rounded-full">
              {filteredUpcoming.length}
            </span>
          )}
          {activeTab === "upcoming" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue animate-fade-in" />
          )}
        </button>

        {isTherapist && (
          <button
            onClick={() => setActiveTab("patients")}
            className={`px-6 py-3 font-semibold transition-colors relative whitespace-nowrap cursor-pointer ${
              activeTab === "patients"
                ? "text-brand-blue"
                : "text-healthcare-text-muted hover:text-healthcare-text"
            }`}
          >
            My Patients
            {activeTab === "patients" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue animate-fade-in" />
            )}
          </button>
        )}

        <button
          onClick={() => setActiveTab("past")}
          className={`px-6 py-3 font-semibold transition-colors relative whitespace-nowrap cursor-pointer ${
            activeTab === "past"
              ? "text-brand-blue"
              : "text-healthcare-text-muted hover:text-healthcare-text"
          }`}
        >
          {isTherapist ? "Session History" : "Past Sessions"}
          {activeTab === "past" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue animate-fade-in" />
          )}
        </button>
      </div>

      {/* Content Area */}
      {activeTab === "patients" && isTherapist ? (
        <PatientList />
      ) : (
        <>
          {currentList.length > 0 ? (
            <div className="space-y-4">
              {currentList.map((appointment) =>
                isTherapist ? (
                  <TherapistAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onViewNotes={handleViewNotes}
                    onCancel={handleCancel}
                  />
                ) : (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onReschedule={handleReschedule}
                    onCancel={handleCancel}
                    isPast={activeTab === "past"}
                  />
                ),
              )}
            </div>
          ) : (
            <div className="bg-white rounded-[16px] border border-healthcare-border p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-healthcare-surface rounded-full flex items-center justify-center mx-auto mb-4 text-healthcare-text-muted">
                <svg
                  className="w-8 h-8"
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
              <h3 className="text-xl font-bold text-healthcare-text mb-2">
                No {activeTab === "upcoming" ? "upcoming" : "past"} sessions
              </h3>
              <p className="text-healthcare-text-muted mb-6 max-w-md mx-auto">
                {activeTab === "upcoming"
                  ? isTherapist
                    ? "You have no upcoming sessions scheduled."
                    : "Book your first session to start your wellness journey."
                  : "No past session history available."}
              </p>
              {!isTherapist && activeTab === "upcoming" && (
                <Link
                  to="/therapists"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-healthcare-text transition-colors no-underline shadow-lg shadow-brand-blue/20"
                >
                  Find a Therapist
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              )}
            </div>
          )}
        </>
      )}

      {/* Meeting Link Info for Patient */}
      {!isTherapist && activeTab === "upcoming" && filteredUpcoming.length > 0 && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-green-800">About Meeting Links</p>
              <p className="text-sm text-green-700">
                Each session includes a unique meeting link. Click "Join Session" to access your video consultation.
                Links become active 15 minutes before your scheduled time.
              </p>
            </div>
          </div>
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
          isTherapist={isTherapist}
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
