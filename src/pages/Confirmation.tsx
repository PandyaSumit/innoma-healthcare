import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import type { Appointment } from '../data/appointments';

const Confirmation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { addBookedAppointment, generateMeetingLink, generateInvoiceNumber } = useBooking();
  const { therapist, package: pkg, date, time, invoiceNumber: passedInvoice, total } = location.state || {};

  const [meetingLink, setMeetingLink] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [isAppointmentSaved, setIsAppointmentSaved] = useState(false);

  // Generate meeting link and save appointment on mount
  useEffect(() => {
    if (therapist && pkg && date && time && !isAppointmentSaved) {
      const newMeetingLink = generateMeetingLink();
      const newInvoiceNumber = passedInvoice || generateInvoiceNumber();

      setMeetingLink(newMeetingLink);
      setInvoiceNumber(newInvoiceNumber);

      // Convert time from "10:00 AM" format to "10:00" format
      const timeMatch = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      let formattedTime = time;
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2];
        const period = timeMatch[3].toUpperCase();

        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }
        formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
      }

      // Create the appointment object
      const newAppointment: Appointment = {
        id: `apt-${Date.now()}`,
        therapistId: therapist.id,
        therapistName: therapist.name,
        therapistPhoto: therapist.photo,
        specialization: therapist.specializations?.[0] || 'General Therapy',
        patientId: user?.profile?.id || 'patient-001',
        patientName: user?.profile?.name || 'Patient',
        patientPhoto: user?.profile?.avatar,
        date: date,
        time: formattedTime,
        duration: 50,
        type: pkg.id === 'single' ? 'Consultation' : 'Follow-up',
        status: 'Upcoming',
        fee: pkg.price,
        meetingLink: newMeetingLink,
        reschedulesLeft: 2,
        paymentStatus: 'Paid',
        invoiceNumber: newInvoiceNumber,
      };

      // Save to context/localStorage
      addBookedAppointment(newAppointment);
      setIsAppointmentSaved(true);
    }
  }, [therapist, pkg, date, time, user, addBookedAppointment, generateMeetingLink, generateInvoiceNumber, passedInvoice, isAppointmentSaved]);

  if (!therapist || !pkg || !date || !time) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-healthcare-text mb-4">Invalid confirmation details</h2>
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-healthcare-text transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const appointmentDate = new Date(date);
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingLink);
    alert('Meeting link copied to clipboard!');
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto py-8">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-healthcare-text mb-3">Appointment Confirmed!</h1>
          <p className="text-lg text-healthcare-text-muted">
            Your session with {therapist.name} has been successfully booked
          </p>
        </div>

        {/* Confirmation Details Card */}
        <div className="bg-white rounded-lg border border-healthcare-border overflow-hidden mb-6">
          {/* Header with Pattern */}
          <div className="bg-gradient-to-r from-brand-blue to-healthcare-lavender p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm opacity-90 mb-1">Booking Reference</p>
                <p className="text-2xl font-bold">{invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90 mb-1">Total Paid</p>
                <p className="text-2xl font-bold">&#8377;{total}</p>
              </div>
            </div>
          </div>

          {/* Therapist & Session Details */}
          <div className="p-8">
            <div className="flex gap-6 mb-8">
              <img
                src={therapist.photo}
                alt={therapist.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-healthcare-text mb-2">{therapist.name}</h2>
                <p className="text-healthcare-text-muted mb-3">{therapist.qualifications}</p>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(therapist.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-healthcare-text">{therapist.rating}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-healthcare-surface rounded-lg">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-brand-blue flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-healthcare-text-muted mb-1">Date & Time</p>
                    <p className="font-bold text-healthcare-text">{formattedDate}</p>
                    <p className="font-bold text-healthcare-text">{time}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-healthcare-surface rounded-lg">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-brand-blue flex-shrink-0"
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
                  <div>
                    <p className="text-sm text-healthcare-text-muted mb-1">Duration</p>
                    <p className="font-bold text-healthcare-text">50 minutes</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-healthcare-surface rounded-lg">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-brand-blue flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-healthcare-text-muted mb-1">Package</p>
                    <p className="font-bold text-healthcare-text">{pkg.name}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-healthcare-surface rounded-lg">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-brand-blue flex-shrink-0"
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
                  <div>
                    <p className="text-sm text-healthcare-text-muted mb-1">Session Type</p>
                    <p className="font-bold text-healthcare-text">Video Consultation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Meeting Link Section */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-green-800 mb-2">Your Meeting Link</h3>
                  <p className="text-sm text-green-700 mb-3">
                    Use this link to join your video session at the scheduled time. The link will be active 15 minutes before your appointment.
                  </p>
                  <div className="flex items-center gap-2 bg-white border border-green-200 rounded-lg p-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <code className="flex-1 text-sm text-green-800 break-all">{meetingLink}</code>
                    <button
                      onClick={copyMeetingLink}
                      className="px-3 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors flex-shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-healthcare-lavender/20 rounded-lg border border-healthcare-lavender/30 p-6">
              <h3 className="text-lg font-bold text-healthcare-text mb-4">Next Steps</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p className="text-sm text-healthcare-text">
                    Confirmation email sent to your registered email address
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p className="text-sm text-healthcare-text">
                    WhatsApp reminder will be sent 24 hours before your session
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p className="text-sm text-healthcare-text">
                    <strong>Join using the meeting link</strong> above, which will be active 15 minutes before your session
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <p className="text-sm text-healthcare-text">
                    You can reschedule up to 2 times (minimum 24 hours before session)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/appointments"
            className="px-8 py-3 bg-brand-blue text-white rounded-lg font-bold hover:bg-healthcare-text transition-colors text-center no-underline"
          >
            View My Sessions
          </Link>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 border-2 border-brand-blue text-brand-blue rounded-lg font-bold hover:bg-brand-blue hover:text-white transition-colors"
          >
            Download Receipt
          </button>
          <Link
            to="/therapists"
            className="px-8 py-3 border-2 border-healthcare-border text-healthcare-text rounded-lg font-bold hover:bg-healthcare-surface transition-colors text-center no-underline"
          >
            Browse Therapists
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
