import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UPCOMING_APPOINTMENTS, PAST_APPOINTMENTS } from "../data/appointments";
import type { Appointment } from "../data/appointments";
import AppointmentCard from "../components/AppointmentCard";
import TherapistAppointmentCard from "../components/appointments/TherapistAppointmentCard";
import PatientList from "../components/appointments/PatientList";
import { RescheduleModal } from "../components/appointments/RescheduleModal";
import { CancelModal } from "../components/appointments/CancelModal";

const Appointments = () => {
  const { user } = useAuth();
  const isTherapist = user?.role === "therapist";

  // Tabs for Patient: 'upcoming', 'past'
  // Tabs for Therapist: 'upcoming', 'patients', 'past'
  const [searchParams, setSearchParams] = useSearchParams();

  // Tabs for Patient: 'upcoming', 'past'
  // Tabs for Therapist: 'upcoming', 'patients', 'past'
  // Get tab from URL or default to 'upcoming'
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

  // Filter appointments based on role (Mock filtering since data is static)
  // In a real app, this would be handled by the backend
  const filteredUpcoming = isTherapist
    ? UPCOMING_APPOINTMENTS // Show all upcoming for therapist (or filter by therapistId if we had mult users)
    : UPCOMING_APPOINTMENTS; // Show all for patient (mock)

  const filteredPast = isTherapist ? PAST_APPOINTMENTS : PAST_APPOINTMENTS;

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
    // Placeholder for viewing notes logic
    console.log("View notes for", appointment.id);
  };

  return (
    <div className="mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-healthcare-text mb-2">
          {isTherapist ? "Practice Management" : "My Appointments"}
        </h1>
        <p className="text-healthcare-text-muted">
          {isTherapist
            ? "Manage your sessions and patient records"
            : "Manage your therapy sessions and view appointment history"}
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
          {isTherapist ? "Session History" : "Past"}
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
                No appointments found
              </h3>
              <p className="text-healthcare-text-muted mb-6 max-w-md mx-auto">
                {activeTab === "upcoming"
                  ? isTherapist
                    ? "You have no upcoming sessions scheduled for today."
                    : "You have no upcoming appointments. Book your first session to start your journey."
                  : "No past appointment history available."}
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
