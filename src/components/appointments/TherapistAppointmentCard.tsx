import type { Appointment } from "../../data/appointments";

const TherapistAppointmentCard = ({
  appointment,
  onViewNotes,
  onCancel,
}: {
  appointment: Appointment;
  onViewNotes: (apt: Appointment) => void;
  onCancel: (apt: Appointment) => void;
}) => {
  const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
  const now = new Date();
  const timeDiff = appointmentDate.getTime() - now.getTime();
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
  const canJoin = minutesDiff <= 15 && minutesDiff >= -60; // Allow join 15m before and during session

  return (
    <div className="bg-white rounded-[16px] border border-healthcare-border p-5 hover:shadow-clinical hover:border-brand-blue/30 transition-all group animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center gap-4 lg:gap-6 justify-between flex-wrap">
        {/* Patient Info - Takes available space */}
        <div className="flex items-center gap-4 min-w-0 flex-1 basis-full md:basis-auto">
          <div className="relative flex-shrink-0">
            <img
              src={
                appointment.patientPhoto ||
                `https://ui-avatars.com/api/?name=${appointment.patientName}&background=random`
              }
              alt={appointment.patientName}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
            {appointment.status === "Upcoming" && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-healthcare-text text-lg truncate leading-tight mb-0.5">
              {appointment.patientName}
            </h3>
            <div className="flex items-center gap-2 text-sm text-healthcare-text-muted">
              <span className="font-medium bg-healthcare-surface px-2 py-0.5 rounded text-healthcare-text-secondary text-xs uppercase tracking-wide flex-shrink-0">
                #{appointment.patientId?.split("-")[1]}
              </span>
              <span>•</span>
              <span className="truncate">{appointment.type}</span>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-4 bg-healthcare-surface/50 rounded-xl p-3 md:px-6 md:py-2 border border-healthcare-border/50 md:border-transparent flex-shrink-0 w-full md:w-auto">
          <div className="flex flex-col items-start md:items-center">
            <div className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-0.5">
              {appointmentDate.toLocaleDateString("en-US", { month: "short" })}
            </div>
            <div className="text-xl font-bold text-healthcare-text leading-none">
              {appointmentDate.getDate()}
            </div>
          </div>
          <div className="w-px h-8 bg-healthcare-border mx-2 hidden md:block"></div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-healthcare-text font-semibold">
              <svg
                className="w-4 h-4 text-healthcare-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {appointment.time}
            </div>
            <div className="text-xs text-healthcare-text-muted">
              {appointment.duration} mins •{" "}
              {appointmentDate.toLocaleDateString("en-US", { weekday: "long" })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 flex-shrink-0">
          {canJoin && appointment.meetingLink && (
            <a
              href={appointment.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none px-5 py-2.5 bg-brand-blue text-white text-sm font-bold rounded-xl hover:bg-brand-blue/90 hover:shadow-lg hover:-translate-y-0.5 transition-all text-center no-underline flex items-center justify-center gap-2"
            >
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
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Join Call
            </a>
          )}
          <button
            onClick={() => onViewNotes(appointment)}
            className="flex-1 md:flex-none px-5 py-2.5 border border-healthcare-border text-healthcare-text text-sm font-bold rounded-xl hover:bg-healthcare-surface hover:text-brand-blue transition-colors cursor-pointer whitespace-nowrap min-w-[120px]"
          >
            View Details
          </button>

          <button
            onClick={() => onCancel(appointment)}
            className="p-3 text-red-500 hover:bg-red-50 rounded-[10px] transition-colors cursor-pointer flex-shrink-0 hover:shadow-sm border border-transparent hover:border-red-50"
            title="Cancel Session"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TherapistAppointmentCard;
