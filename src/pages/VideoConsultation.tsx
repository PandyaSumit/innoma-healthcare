import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { UPCOMING_APPOINTMENTS, PAST_APPOINTMENTS } from '../data/appointments';

const VideoConsultation = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Find appointment
  const appointment = [...UPCOMING_APPOINTMENTS, ...PAST_APPOINTMENTS].find(
    (apt) => apt.id === appointmentId
  );

  useEffect(() => {
    let timer: number;
    if (sessionStarted && !sessionEnded) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionStarted, sessionEnded]);

  if (!appointment) {
    return (
      <div className="min-h-screen bg-healthcare-surface flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-healthcare-text mb-4">Appointment not found</h2>
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSession = () => {
    setSessionStarted(true);
  };

  const handleEndSession = () => {
    setSessionStarted(false);
    setSessionEnded(true);
  };

  const handleSubmitFeedback = () => {
    // Mock feedback submission
    alert('Thank you for your feedback!');
    navigate('/appointments');
  };

  // Pre-session view
  if (!sessionStarted && !sessionEnded) {
    const appointmentTime = new Date(`${appointment.date}T${appointment.time}`);
    const canJoin = new Date().getTime() >= appointmentTime.getTime() - 15 * 60 * 1000;

    return (
      <div className="min-h-screen bg-healthcare-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg border border-healthcare-border overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-blue to-healthcare-lavender p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Video Consultation</h1>
              <p className="text-white/90">Prepare for your session</p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Therapist Info */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-healthcare-border">
                <img
                  src={appointment.therapistPhoto}
                  alt={appointment.therapistName}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div>
                  <h2 className="text-2xl font-bold text-healthcare-text mb-2">
                    {appointment.therapistName}
                  </h2>
                  <p className="text-healthcare-text-muted mb-2">{appointment.specialization}</p>
                  <p className="text-sm text-healthcare-text">
                    {new Date(appointment.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    at {appointment.time}
                  </p>
                </div>
              </div>

              {/* Pre-session Checklist */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-healthcare-text mb-4">Before You Join</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-healthcare-surface rounded-lg">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-semibold text-healthcare-text mb-1">Find a quiet space</p>
                      <p className="text-sm text-healthcare-text-muted">
                        Choose a private, comfortable location without distractions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-healthcare-surface rounded-lg">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-semibold text-healthcare-text mb-1">Test your device</p>
                      <p className="text-sm text-healthcare-text-muted">
                        Ensure your camera, microphone, and speakers are working
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-healthcare-surface rounded-lg">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-semibold text-healthcare-text mb-1">Stable internet connection</p>
                      <p className="text-sm text-healthcare-text-muted">
                        Connect to a reliable Wi-Fi network for the best experience
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-healthcare-surface rounded-lg">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-semibold text-healthcare-text mb-1">Have your notes ready</p>
                      <p className="text-sm text-healthcare-text-muted">
                        Prepare any topics or questions you'd like to discuss
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Join Button */}
              <div className="text-center">
                {canJoin ? (
                  <button
                    onClick={handleStartSession}
                    className="px-12 py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-colors"
                  >
                    Join Session
                  </button>
                ) : (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-healthcare-lavender/20 border border-healthcare-lavender/30 rounded-lg mb-4">
                      <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-healthcare-text font-semibold">
                        Session will be available 15 minutes before the scheduled time
                      </p>
                    </div>
                    <p className="text-sm text-healthcare-text-muted">
                      You can test your audio and video in the meantime
                    </p>
                  </div>
                )}
              </div>

              {/* Tech Check */}
              <div className="mt-8 pt-8 border-t border-healthcare-border">
                <button className="w-full px-6 py-3 border-2 border-brand-blue text-brand-blue rounded-lg font-semibold hover:bg-brand-blue hover:text-white transition-colors">
                  Test Audio & Video
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Post-session feedback view
  if (sessionEnded) {
    return (
      <div className="min-h-screen bg-healthcare-surface">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg border border-healthcare-border p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-healthcare-text mb-2">Session Completed</h2>
              <p className="text-healthcare-text-muted">Thank you for attending your session</p>
            </div>

            {/* Therapist Rating */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-healthcare-text mb-4 text-center">
                How was your session?
              </h3>
              <div className="flex justify-center gap-3 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-12 h-12 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-semibold text-healthcare-text mb-2">
                  Share your feedback (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us about your experience..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSubmitFeedback}
                className="w-full px-6 py-3 bg-brand-blue text-white rounded-lg font-bold hover:bg-healthcare-text transition-colors"
              >
                Submit Feedback
              </button>
              <Link
                to={`/book/${appointment.therapistId}`}
                className="block w-full px-6 py-3 border-2 border-brand-blue text-brand-blue rounded-lg font-bold hover:bg-brand-blue hover:text-white transition-colors text-center no-underline"
              >
                Book Next Session
              </Link>
              <Link
                to="/appointments"
                className="block w-full px-6 py-3 border border-healthcare-border text-healthcare-text rounded-lg font-semibold hover:bg-healthcare-surface transition-colors text-center no-underline"
              >
                View All Appointments
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active session view
  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Mock Video Display */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-white text-lg font-semibold mb-2">Connected to {appointment.therapistName}</p>
            <p className="text-gray-400">Video consultation in progress</p>
          </div>
        </div>

        {/* Session Info Overlay */}
        <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-white font-semibold">{formatTime(elapsedTime)}</span>
        </div>

        {/* Therapist Name Overlay */}
        <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
          <span className="text-white font-semibold">{appointment.therapistName}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 border-t border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mute */}
            <button className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>

            {/* Video */}
            <button className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          {/* End Call */}
          <button
            onClick={handleEndSession}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-full font-bold text-white transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            End Session
          </button>

          <div className="flex items-center gap-4">
            {/* Share Screen */}
            <button className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>

            {/* Settings */}
            <button className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultation;
