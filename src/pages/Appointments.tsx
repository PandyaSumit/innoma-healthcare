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
    ...UPCOMING_APPOINTMENTS.filter((apt) => apt.patientId === "patient-001"),
    ...bookedAppointments.filter((apt) => {
      const aptDate = new Date(`${apt.date}T${apt.time}`);
      return aptDate >= now && apt.status === "Upcoming";
    }),
  ];

  const patientPast = [
    ...PAST_APPOINTMENTS.filter((apt) => apt.patientId === "patient-001"),
    ...bookedAppointments.filter((apt) => {
      const aptDate = new Date(`${apt.date}T${apt.time}`);
      return aptDate < now || apt.status === "Completed";
    }),
  ];

  // For therapist view - show all appointments
  const therapistUpcoming = [
    ...UPCOMING_APPOINTMENTS,
    ...bookedAppointments.filter((apt) => {
      const aptDate = new Date(`${apt.date}T${apt.time}`);
      return aptDate >= now && apt.status === "Upcoming";
    }),
  ];

  const therapistPast = [
    ...PAST_APPOINTMENTS,
    ...bookedAppointments.filter((apt) => {
      const aptDate = new Date(`${apt.date}T${apt.time}`);
      return aptDate < now || apt.status === "Completed";
    }),
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
    <div>
      <div>
        {/* ================= HEADER ================= */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-healthcare-text">
            {isTherapist ? "Practice Management" : "My Sessions"}
          </h1>
          <p className="text-sm text-healthcare-text-muted mt-1">
            {isTherapist
              ? "Manage your sessions and patient records"
              : "View and manage your therapy sessions"}
          </p>
        </div>

        {/* ================= TABS ================= */}
        <div className="flex gap-3 mb-6 border-b border-healthcare-border overflow-x-auto no-scrollbar">
          {[
            {
              key: "upcoming",
              label: isTherapist ? "Upcoming Sessions" : "Upcoming",
            },
            isTherapist && { key: "patients", label: "My Patients" },
            {
              key: "past",
              label: isTherapist ? "Session History" : "Past Sessions",
            },
          ]
            .filter(Boolean)
            .map((tab: any) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 cursor-pointer sm:px-6 py-3 text-sm sm:text-base font-semibold whitespace-nowrap relative transition ${
                  activeTab === tab.key
                    ? "text-brand-blue"
                    : "text-healthcare-text-muted hover:text-healthcare-text"
                }`}
              >
                {tab.label}

                {tab.key === "upcoming" && filteredUpcoming.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-xs rounded-full">
                    {filteredUpcoming.length}
                  </span>
                )}

                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" />
                )}
              </button>
            ))}
        </div>

        {/* ================= CONTENT ================= */}
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
              <div className="bg-white border border-healthcare-border rounded-xl p-8 sm:p-12 text-center mt-6">
                <div className="w-14 h-14 bg-healthcare-surface rounded-full flex items-center justify-center mx-auto mb-4 text-healthcare-text-muted">
                  <svg
                    className="w-7 h-7"
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

                <h3 className="text-lg sm:text-xl font-semibold text-healthcare-text mb-2">
                  No {activeTab === "upcoming" ? "upcoming" : "past"} sessions
                </h3>

                <p className="text-sm text-healthcare-text-muted max-w-md mx-auto mb-5">
                  {activeTab === "upcoming"
                    ? isTherapist
                      ? "You currently have no sessions scheduled."
                      : "Book your first session to begin your wellness journey."
                    : "No session history available."}
                </p>

                {!isTherapist && activeTab === "upcoming" && (
                  <Link
                    to="/therapists"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold no-underline"
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

        {/* ================= INFO ================= */}
        {/* {!isTherapist &&
          activeTab === "upcoming" &&
          filteredUpcoming.length > 0 && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-800 font-medium mb-1">
                About meeting links
              </p>
              <p className="text-sm text-green-700">
                Meeting links activate 15 minutes before the session start time.
                Click <strong>Join Session</strong> to connect with your
                therapist.
              </p>
            </div>
          )} */}

        {/* ================= MODALS ================= */}
        {showRescheduleModal && selectedAppointment && (
          <RescheduleModal
            appointment={selectedAppointment}
            onClose={() => {
              setShowRescheduleModal(false);
              setSelectedAppointment(null);
            }}
          />
        )}

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
    </div>
  );
};

export default Appointments;
