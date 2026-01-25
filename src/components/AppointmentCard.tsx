import { Link } from 'react-router-dom';
import type { Appointment } from '../data/appointments';

interface AppointmentCardProps {
  appointment: Appointment;
  onReschedule: (apt: Appointment) => void;
  onCancel: (apt: Appointment) => void;
  isPast: boolean;
}

const AppointmentCard = ({
  appointment,
  onReschedule,
  onCancel,
  isPast,
}: AppointmentCardProps) => {
  const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
  
  const now = new Date();
  const timeDiff = appointmentDate.getTime() - now.getTime();
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
  const canJoin = minutesDiff <= 15 && minutesDiff >= 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all overflow-hidden">
      {/* Main Content */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Therapist Image & Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={appointment.therapistPhoto}
              alt={appointment.therapistName}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-base truncate">{appointment.therapistName}</h3>
              <p className="text-xs text-gray-500 truncate mb-1">{appointment.specialization}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 text-gray-600">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {appointmentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="text-gray-300">•</span>
                <span className="font-medium text-gray-700">{appointment.time}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600">{appointment.duration}m</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 sm:w-auto">
            {!isPast ? (
              <>
                <Link
                  to={`/join/${appointment.id}`}
                  className={`flex-1 sm:flex-none px-5 py-2 ${
                    canJoin 
                      ? 'bg-green-600 hover:bg-green-700 shadow-sm' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white text-sm font-semibold rounded-md transition-all text-center no-underline whitespace-nowrap`}
                >
                  {canJoin ? '▶ Join' : 'View'}
                </Link>
                <button
                  onClick={() => onReschedule(appointment)}
                  disabled={appointment.reschedulesLeft === 0}
                  className="hidden sm:block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Reschedule"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  onClick={() => onCancel(appointment)}
                  className="hidden sm:block px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-all"
                  title="Cancel"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <Link
                  to={`/book/${appointment.therapistId}`}
                  className="flex-1 sm:flex-none px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-all text-center no-underline whitespace-nowrap"
                >
                  Book Again
                </Link>
                {appointment.rating && (
                  <div className="flex items-center gap-1 px-3 py-2 bg-yellow-50 rounded-md">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">{appointment.rating}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Actions Menu */}
        {!isPast && (
          <div className="sm:hidden flex gap-2 mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => onReschedule(appointment)}
              disabled={appointment.reschedulesLeft === 0}
              className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-all disabled:opacity-30"
            >
              Reschedule ({appointment.reschedulesLeft})
            </button>
            <button
              onClick={() => onCancel(appointment)}
              className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-all"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Session Notes - Compact */}
        {isPast && appointment.sessionNotes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                <span>Session Notes</span>
                <svg className="w-4 h-4 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{appointment.sessionNotes}</p>
            </details>
          </div>
        )}
      </div>

      {/* Bottom Tags */}
      <div className="px-4 sm:px-5 pb-4 flex flex-wrap gap-2">
        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
          {appointment.type}
        </span>
        {appointment.fee === 0 && (
          <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md">
            FREE SESSION
          </span>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
