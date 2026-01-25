import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { useAppointments } from '../context/AppointmentContext';
import { useToast } from '../context/ToastContext';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, clearBooking } = useBooking();
  const { addAppointment } = useAppointments();
  const { success } = useToast();
  const [isProcessed, setIsProcessed] = useState(false);

  // Get data from location state or booking context
  const therapist = location.state?.therapist || booking.therapist;
  const pkg = location.state?.package || booking.selectedPackage;
  const date = location.state?.date || booking.selectedDate;
  const time = location.state?.time || booking.selectedTime;
  const invoiceNumber = location.state?.invoiceNumber || `INN-${Date.now()}`;
  const isAssessment = location.state?.isAssessment || booking.isAssessment;

  // Calculate total
  const subtotal = isAssessment ? 0 : (pkg?.price || 0);
  const gst = Math.round(subtotal * 0.18);
  const total = location.state?.total || (subtotal + gst);

  // Create appointment on mount (only once)
  useEffect(() => {
    if (!isProcessed && therapist && date && time) {
      addAppointment({
        therapistId: therapist.id,
        therapistName: therapist.name,
        therapistPhoto: therapist.photo,
        specialization: therapist.specializations?.[0] || 'Mental Health',
        date: date,
        time: time,
        duration: isAssessment ? 30 : 50,
        type: isAssessment ? 'Assessment' : 'Consultation',
        status: 'Upcoming',
        fee: total,
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        reschedulesLeft: 2,
        paymentStatus: 'Paid',
        invoiceNumber: invoiceNumber,
      });
      setIsProcessed(true);
      clearBooking();
    }
  }, []);

  if (!therapist || !date || !time) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-10 shadow-clinical border border-healthcare-border max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-healthcare-text mb-2">No Booking Found</h2>
          <p className="text-healthcare-text-muted mb-6">We couldn't find your booking details. Please try booking again.</p>
          <Link
            to="/therapists"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-brand-blue/90 transition-all no-underline"
          >
            Browse Therapists
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

  // Format time for display
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  // Generate calendar event URLs
  const generateCalendarUrls = () => {
    const startDate = new Date(`${date}T${time}:00`);
    const endDate = new Date(startDate.getTime() + (isAssessment ? 30 : 50) * 60000);

    const title = `${isAssessment ? 'Assessment' : 'Consultation'} with ${therapist.name}`;
    const description = `Mental health ${isAssessment ? 'assessment' : 'consultation'} session with ${therapist.name} via Innoma Healthcare.\n\nJoin Link: https://meet.google.com/abc-defg-hij\n\nBooking Reference: ${invoiceNumber}`;
    const location = 'Online - Video Consultation';

    // Format dates for Google Calendar
    const formatGoogleDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');

    // Google Calendar URL
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

    // Outlook Calendar URL
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

    // iCal file content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Innoma Healthcare//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${invoiceNumber}@innoma.health
DTSTAMP:${formatGoogleDate(new Date())}
DTSTART:${formatGoogleDate(startDate)}
DTEND:${formatGoogleDate(endDate)}
SUMMARY:${title}
DESCRIPTION:${description.replace(/\n/g, '\\n')}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

    return { googleUrl, outlookUrl, icsContent };
  };

  const { googleUrl, outlookUrl, icsContent } = generateCalendarUrls();

  const downloadIcs = () => {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `innoma-appointment-${invoiceNumber}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    success('Calendar Downloaded', 'Open the .ics file to add to your calendar');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto pb-10 animate-fade-in">
      {/* Success Animation */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center">
            <span className="text-lg">🎉</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-healthcare-text mb-3">
          {isAssessment ? 'Assessment Booked!' : 'Appointment Confirmed!'}
        </h1>
        <p className="text-lg text-healthcare-text-muted max-w-lg mx-auto">
          Your {isAssessment ? 'free assessment' : 'session'} with {therapist.name} has been successfully scheduled
        </p>
      </div>

      {/* Confirmation Card */}
      <div className="bg-white rounded-2xl shadow-clinical border border-healthcare-border overflow-hidden mb-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-brand-blue via-brand-blue to-healthcare-lavender p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm opacity-80 mb-1">Booking Reference</p>
              <p className="text-2xl md:text-3xl font-bold tracking-wide">{invoiceNumber}</p>
            </div>
            <div className="md:text-right">
              <p className="text-sm opacity-80 mb-1">{isAssessment ? 'Session Fee' : 'Total Paid'}</p>
              <p className="text-2xl md:text-3xl font-bold">
                {isAssessment ? 'FREE' : `₹${total.toLocaleString()}`}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Therapist Info */}
          <div className="flex gap-4 md:gap-6 mb-8 pb-8 border-b border-healthcare-border">
            <img
              src={therapist.photo}
              alt={therapist.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-md"
            />
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-healthcare-text mb-1">{therapist.name}</h2>
              <p className="text-sm text-healthcare-text-muted mb-3">{therapist.qualifications}</p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(therapist.rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-semibold text-healthcare-text">{therapist.rating}</span>
                <span className="text-sm text-healthcare-text-muted">({therapist.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Session Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-healthcare-surface rounded-xl">
              <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs text-healthcare-text-muted mb-1">Date</p>
              <p className="text-sm font-bold text-healthcare-text">{formattedDate}</p>
            </div>

            <div className="p-4 bg-healthcare-surface rounded-xl">
              <div className="w-10 h-10 bg-brand-orange/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-healthcare-text-muted mb-1">Time</p>
              <p className="text-sm font-bold text-healthcare-text">{formatTime(time)} IST</p>
            </div>

            <div className="p-4 bg-healthcare-surface rounded-xl">
              <div className="w-10 h-10 bg-healthcare-lavender/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-healthcare-lavender" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs text-healthcare-text-muted mb-1">Session Type</p>
              <p className="text-sm font-bold text-healthcare-text">Video Call</p>
            </div>

            <div className="p-4 bg-healthcare-surface rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-healthcare-text-muted mb-1">Duration</p>
              <p className="text-sm font-bold text-healthcare-text">{isAssessment ? '30' : '50'} minutes</p>
            </div>
          </div>

          {/* Add to Calendar Section */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-healthcare-text mb-3">Add to Calendar</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-healthcare-border rounded-xl text-sm font-medium text-healthcare-text hover:bg-healthcare-surface hover:border-brand-blue/30 transition-all no-underline"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google Calendar
              </a>

              <a
                href={outlookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-healthcare-border rounded-xl text-sm font-medium text-healthcare-text hover:bg-healthcare-surface hover:border-brand-blue/30 transition-all no-underline"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#0078D4" d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
                  <path fill="#28A8EA" d="M12 2L2 7v10l10 5V12L12 2z"/>
                  <path fill="#0078D4" d="M12 12v10l10-5V7l-10 5z"/>
                  <path fill="#50D9FF" d="M2 7l10 5 10-5-10-5L2 7z"/>
                </svg>
                Outlook
              </a>

              <button
                onClick={downloadIcs}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-healthcare-border rounded-xl text-sm font-medium text-healthcare-text hover:bg-healthcare-surface hover:border-brand-blue/30 transition-all"
              >
                <svg className="w-5 h-5 text-healthcare-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download .ics
              </button>
            </div>
          </div>

          {/* Next Steps Checklist */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-5">
            <h3 className="text-base font-bold text-green-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What's Next
            </h3>
            <div className="space-y-3">
              {[
                'Confirmation email sent to your inbox',
                'WhatsApp reminder 24 hours before session',
                'Join link available 15 minutes before',
                'You can reschedule up to 2 times (24h notice)',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-green-800">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/dashboard"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-blue text-white rounded-xl font-bold hover:bg-brand-blue/90 transition-all shadow-lg shadow-brand-blue/20 no-underline"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go to Dashboard
        </Link>
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-brand-blue text-brand-blue rounded-xl font-bold hover:bg-brand-blue hover:text-white transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Receipt
        </button>
        <Link
          to="/therapists"
          className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-healthcare-border text-healthcare-text rounded-xl font-bold hover:bg-healthcare-surface transition-all no-underline"
        >
          Browse Therapists
        </Link>
      </div>
    </div>
  );
};

export default Confirmation;
