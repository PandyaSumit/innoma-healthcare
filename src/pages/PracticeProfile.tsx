import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { api } from "../api"; // make sure your axios instance or fetch wrapper is imported

export interface Patient {
  id: string;
  name: string;
  photo?: string | null;
  email: string;
  phone?: string | null;
  dob?: string | null;
  age?: number | null;
  gender?: string | null;
  occupation?: string | null;
  bloodGroup?: string | null;
  bio?: string | null;
  healthInterests: string[];
  allergies?: string | null;
  medications?: string | null;
  emergencyContact?: string | null;
  memberSince: string;
  totalSessions: number;
  lastVisit?: string | null;
  status: string;
  avatar_url?: string | null;
}

const fetchPatientById = async (id: string) => {
  const { data } = await api.get(`/therapists/me/patients/${id}`);
  return data.data as Patient;
};

const PatientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backPath = location.pathname.startsWith("/find-practice")
    ? "/find-practice"
    : "/patients";

  useEffect(() => {
    const loadPatient = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchPatientById(id);
        setPatient(data);
      } catch (err: any) {
        console.error("Failed to fetch patient:", err);
        setError("Patient not found");
      } finally {
        setIsLoading(false);
      }
    };

    loadPatient();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 text-healthcare-text">
            {error || "Patient not found"}
          </h2>
          <Link
            to={backPath}
            className="px-5 py-2.5 rounded-lg bg-brand-blue text-white no-underline inline-block"
          >
            Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-healthcare-surface min-h-screen p-5 sm:p-8">
      {/* ================= HEADER ================= */}
      <section className="bg-white border border-healthcare-border rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
        {/* Photo */}
        <img
          src={patient.avatar_url || patient.photo || "/default-avatar.png"}
          alt={patient.name}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover shrink-0"
        />

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-healthcare-text">
                {patient.name}
              </h1>
              <p className="text-sm text-healthcare-text-muted">
                {patient.email}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6 text-sm text-healthcare-text-muted">
            <span>
              <strong className="text-healthcare-text">
                {patient.totalSessions}
              </strong>{" "}
              sessions
            </span>
            <span>
              <strong className="text-healthcare-text">{patient.status}</strong>{" "}
              status
            </span>
            <span>
              <strong className="text-healthcare-text">
                {patient.lastVisit || "N/A"}
              </strong>{" "}
              last visit
            </span>
          </div>
        </div>
      </section>

      {/* ================= CONTENT GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About / Bio */}
          <section className="bg-white border border-healthcare-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3">About</h2>
            <p className="text-healthcare-text-muted leading-relaxed">
              {patient.bio || "No bio available"}
            </p>
          </section>

          {/* Health Interests */}
          <section className="bg-white border border-healthcare-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3">Health Interests</h2>
            <div className="flex flex-wrap gap-2">
              {patient.healthInterests.length > 0 ? (
                patient.healthInterests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 rounded-full bg-healthcare-surface text-sm text-healthcare-text-muted"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-sm text-healthcare-text-muted">
                  No interests listed
                </p>
              )}
            </div>
          </section>

          {/* Medications / Allergies */}
          <section className="bg-white border border-healthcare-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3">Medical Info</h2>
            <p className="text-sm text-healthcare-text-muted">
              <strong>Allergies:</strong> {patient.allergies || "None"}
            </p>
            <p className="text-sm text-healthcare-text-muted">
              <strong>Medications:</strong> {patient.medications || "None"}
            </p>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white border border-healthcare-border rounded-xl p-6 space-y-2 text-sm text-healthcare-text-muted">
            <h3 className="text-sm font-semibold mb-2">Quick info</h3>
            <p>Age: {patient.age || "N/A"}</p>
            <p>Gender: {patient.gender || "N/A"}</p>
            <p>Occupation: {patient.occupation || "N/A"}</p>
            <p>Blood Group: {patient.bloodGroup || "N/A"}</p>
            <p>Phone: {patient.phone || "N/A"}</p>
            <p>
              Member Since: {new Date(patient.memberSince).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-healthcare-lavender/20 border border-healthcare-lavender/30 rounded-xl p-6">
            <h3 className="text-sm font-semibold mb-3">Need help?</h3>
            <p className="text-sm text-healthcare-text-muted mb-4">
              Our care team can help you manage this patient.
            </p>
            <Link
              to="/support"
              className="block text-center px-4 py-2 rounded-lg border border-brand-blue text-brand-blue text-sm font-semibold hover:bg-brand-blue hover:text-white transition no-underline"
            >
              Contact support
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PatientProfile;
