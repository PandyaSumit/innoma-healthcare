import { useState } from "react";
import { MOCK_PATIENTS } from "../../data/appointments";
import { useNavigate } from "react-router-dom";
import Input from "../ui/Input";
import { useQuery } from "@tanstack/react-query";
import { fetchTherapistpatients } from "../../api/appointment.api";

const PatientList = () => {
  const router = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch patients from API
  const {
    data: patientsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["therapistPatients"],
    queryFn: fetchTherapistpatients,
  });

  // Filter patients based on search term
  const filteredPatients = (patientsData || []).filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) return <div>Loading patients...</div>;
  if (isError) return <div>Error fetching patients.</div>;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search patients by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-healthcare-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => router(`/find-Practic/${patient?.id}`)}
              className="bg-white rounded-[16px] border border-healthcare-border p-6 hover:shadow-clinical hover:border-brand-blue/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={patient.photo}
                    alt={patient.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-transparent group-hover:ring-brand-blue/10 transition-all"
                  />
                  <div>
                    <h3 className="font-bold text-healthcare-text group-hover:text-brand-blue transition-colors">
                      {patient.name}
                    </h3>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        patient.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-healthcare-text-muted">Last Visit</span>
                  <span className="font-medium text-healthcare-text">
                    {patient.lastVisit || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-healthcare-text-muted">Sessions</span>
                  <span className="font-medium text-healthcare-text">
                    {patient.totalSessions || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-healthcare-text-muted">Diagnosis</span>
                  <span className="font-medium text-healthcare-text truncate max-w-[120px] text-right">
                    {patient.diagnosis?.join(", ") || "N/A"}
                  </span>
                </div>
              </div>

              <button className="w-full py-2.5 rounded-lg bg-healthcare-surface text-healthcare-text font-semibold text-sm group-hover:bg-brand-blue group-hover:text-white transition-all border-none">
                View Patient Profile
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-healthcare-text-muted">
            No patients found matching
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;
