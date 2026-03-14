import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchAppointments } from "../api/appointment.api";
import type { AppointmentRecord } from "../api/appointment.api";
import type { Appointment } from "../data/appointments";
import AppointmentCard from "../components/AppointmentCard";
import TherapistAppointmentCard from "../components/appointments/TherapistAppointmentCard";
import PatientList from "../components/appointments/PatientList";
import { RescheduleModal } from "../components/appointments/RescheduleModal";
import { CancelModal } from "../components/appointments/CancelModal";

// Map API record to local Appointment type used by existing UI components
function toAppointment(r: AppointmentRecord): Appointment {
  return {
    id: r.id,
    therapistId: r.therapist_id,
    therapistName: r.therapist?.name ?? 'Therapist',
    therapistPhoto:
      r.therapist?.avatar_url ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(r.therapist?.name ?? 'T')}&background=random`,
    specialization: '',
    patientId: r.patient_id,
    patientName: r.patient?.name,
    patientPhoto: r.patient?.avatar_url,
    date: r.scheduled_date,
    time: r.scheduled_time,
    duration: r.duration_minutes,
    type: r.type,
    status: r.status,
    fee: r.fee,
    meetingLink: r.meeting_link,
    reschedulesLeft: r.reschedules_left,
    paymentStatus: r.payment_status as 'Paid' | 'Pending' | 'Refunded',
    invoiceNumber: r.invoice_number,
    rating: r.rating,
  };
}

const Appointments = () => {
  const { user } = useAuth();
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

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const loadAppointments = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const [upcomingRes, pastRes] = await Promise.all([
        fetchAppointments({ status: 'Upcoming', limit: 50 }),
        fetchAppointments({ status: 'Completed', limit: 50 }),
      ]);
      const all = [
        ...upcomingRes.data.map(toAppointment),
        ...pastRes.data.map(toAppointment),
      ];
      setAppointments(all);
    } catch (err: any) {
      setFetchError(err?.message ?? 'Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const now = new Date();

  const filteredUpcoming = appointments.filter((apt) => {
    const aptDate = new Date(`${apt.date}T${apt.time}`);
    return aptDate >= now && apt.status === 'Upcoming';
  });

  const filteredPast = appointments.filter((apt) => {
    const aptDate = new Date(`${apt.date}T${apt.time}`);
    return aptDate < now || apt.status === 'Completed' || apt.status === 'Cancelled';
  });

  const currentList = activeTab === "upcoming" ? filteredUpcoming : filteredPast;

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
            { key: "upcoming", label: isTherapist ? "Upcoming Sessions" : "Upcoming" },
            isTherapist && { key: "patients", label: "My Patients" },
            { key: "past", label: isTherapist ? "Session History" : "Past Sessions" },
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
        ) : isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : fetchError ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 mb-3">{fetchError}</p>
            <button
              onClick={loadAppointments}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
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
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                )}
              </div>
            )}
          </>
        )}

        {/* ================= MODALS ================= */}
        {showRescheduleModal && selectedAppointment && (
          <RescheduleModal
            appointment={selectedAppointment}
            onClose={() => {
              setShowRescheduleModal(false);
              setSelectedAppointment(null);
            }}
            onSuccess={() => {
              setShowRescheduleModal(false);
              setSelectedAppointment(null);
              loadAppointments();
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
            onSuccess={() => {
              setShowCancelModal(false);
              setSelectedAppointment(null);
              loadAppointments();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Appointments;
