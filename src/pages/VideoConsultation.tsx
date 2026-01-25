import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppointments } from '../context/AppointmentContext';
import { useToast } from '../context/ToastContext';

const VideoConsultation = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { appointments } = useAppointments();
  const { showToast } = useToast();

  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Video controls state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<{ id: number; sender: string; text: string; time: string }[]>([
    { id: 1, sender: 'therapist', text: 'Hello! How are you feeling today?', time: '10:00 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Device test state
  const [cameraWorking, setCameraWorking] = useState<boolean | null>(null);
  const [micWorking, setMicWorking] = useState<boolean | null>(null);
  const [speakerWorking, setSpeakerWorking] = useState<boolean | null>(null);

  // Find appointment
  const appointment = appointments.find((apt) => apt.id === appointmentId);

  useEffect(() => {
    let timer: number;
    if (sessionStarted && !sessionEnded) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionStarted, sessionEnded]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!appointment) {
    return (
      <div className="min-h-screen bg-healthcare-surface flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-healthcare-text mb-2">Appointment Not Found</h2>
          <p className="text-healthcare-text-muted mb-6">
            The appointment you're looking for doesn't exist or may have been cancelled.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-full font-semibold hover:bg-brand-blue/90 transition-colors no-underline"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSession = () => {
    setSessionStarted(true);
    showToast({ type: 'success', title: 'Connected to session' });
  };

  const handleEndSession = () => {
    setSessionStarted(false);
    setSessionEnded(true);
    showToast({ type: 'info', title: 'Session ended' });
  };

  const handleSubmitFeedback = () => {
    showToast({ type: 'success', title: 'Thank you for your feedback!' });
    navigate('/appointments');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: 'user', text: newMessage, time: timeStr },
    ]);
    setNewMessage('');

    // Simulate therapist response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: 'therapist',
          text: 'I appreciate you sharing that. Let me address that for you.',
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        },
      ]);
    }, 2000);
  };

  const testDevice = (device: 'camera' | 'mic' | 'speaker') => {
    // Simulate device test
    const setter = device === 'camera' ? setCameraWorking : device === 'mic' ? setMicWorking : setSpeakerWorking;
    setter(null);
    setTimeout(() => {
      setter(Math.random() > 0.1); // 90% success rate for demo
    }, 1500);
  };

  // Pre-session view
  if (!sessionStarted && !sessionEnded) {
    const appointmentTime = new Date(`${appointment.date}T${appointment.time}`);
    const canJoin = new Date().getTime() >= appointmentTime.getTime() - 15 * 60 * 1000;
    const allDevicesTested = cameraWorking !== null && micWorking !== null && speakerWorking !== null;
    const allDevicesWorking = cameraWorking && micWorking && speakerWorking;

    return (
      <div className="min-h-screen bg-gradient-to-br from-healthcare-surface via-white to-healthcare-lavender/20 pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Back Button */}
          <Link
            to="/appointments"
            className="inline-flex items-center gap-2 text-healthcare-text-muted hover:text-healthcare-text transition-colors mb-6 no-underline"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Appointments
          </Link>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left: Video Preview & Device Test */}
            <div className="bg-white rounded-2xl border border-healthcare-border shadow-lg overflow-hidden">
              {/* Preview Video */}
              <div className="aspect-video bg-gray-900 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  {isVideoOff ? (
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-400">Camera is off</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-brand-blue to-healthcare-lavender rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-400">Camera preview</p>
                    </div>
                  )}
                </div>

                {/* Preview Controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isMuted ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isMuted ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      )}
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isVideoOff ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isVideoOff ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Device Tests */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-healthcare-text mb-4">Test Your Devices</h3>
                <div className="space-y-3">
                  {/* Camera Test */}
                  <div className="flex items-center justify-between p-3 bg-healthcare-surface rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        cameraWorking === null ? 'bg-gray-200' : cameraWorking ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <svg className={`w-5 h-5 ${
                          cameraWorking === null ? 'text-gray-500' : cameraWorking ? 'text-green-600' : 'text-red-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-healthcare-text">Camera</p>
                        <p className="text-xs text-healthcare-text-muted">
                          {cameraWorking === null ? 'Not tested' : cameraWorking ? 'Working' : 'Not detected'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => testDevice('camera')}
                      className="px-4 py-2 text-sm font-medium text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                    >
                      Test
                    </button>
                  </div>

                  {/* Microphone Test */}
                  <div className="flex items-center justify-between p-3 bg-healthcare-surface rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        micWorking === null ? 'bg-gray-200' : micWorking ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <svg className={`w-5 h-5 ${
                          micWorking === null ? 'text-gray-500' : micWorking ? 'text-green-600' : 'text-red-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-healthcare-text">Microphone</p>
                        <p className="text-xs text-healthcare-text-muted">
                          {micWorking === null ? 'Not tested' : micWorking ? 'Working' : 'Not detected'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => testDevice('mic')}
                      className="px-4 py-2 text-sm font-medium text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                    >
                      Test
                    </button>
                  </div>

                  {/* Speaker Test */}
                  <div className="flex items-center justify-between p-3 bg-healthcare-surface rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        speakerWorking === null ? 'bg-gray-200' : speakerWorking ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <svg className={`w-5 h-5 ${
                          speakerWorking === null ? 'text-gray-500' : speakerWorking ? 'text-green-600' : 'text-red-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-healthcare-text">Speaker</p>
                        <p className="text-xs text-healthcare-text-muted">
                          {speakerWorking === null ? 'Not tested' : speakerWorking ? 'Working' : 'Not detected'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => testDevice('speaker')}
                      className="px-4 py-2 text-sm font-medium text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                    >
                      Test
                    </button>
                  </div>
                </div>

                {/* Status Message */}
                {allDevicesTested && (
                  <div className={`mt-4 p-3 rounded-lg ${allDevicesWorking ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <p className={`text-sm font-medium ${allDevicesWorking ? 'text-green-700' : 'text-yellow-700'}`}>
                      {allDevicesWorking
                        ? 'All devices are working properly!'
                        : 'Some devices may need attention. You can still join the session.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Session Info */}
            <div className="space-y-6">
              {/* Therapist Card */}
              <div className="bg-white rounded-2xl border border-healthcare-border shadow-lg p-6">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={appointment.therapistPhoto}
                    alt={appointment.therapistName}
                    className="w-20 h-20 rounded-xl object-cover ring-2 ring-white shadow-md"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-healthcare-text mb-1">
                      {appointment.therapistName}
                    </h2>
                    <p className="text-healthcare-text-muted text-sm">{appointment.specialization}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-600 text-sm font-medium">Online</span>
                    </div>
                  </div>
                </div>

                {/* Session Details */}
                <div className="space-y-3 p-4 bg-healthcare-surface rounded-xl">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-healthcare-text-muted">Date</p>
                      <p className="font-medium text-healthcare-text">
                        {new Date(appointment.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-healthcare-text-muted">Time</p>
                      <p className="font-medium text-healthcare-text">{appointment.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-healthcare-text-muted">Duration</p>
                      <p className="font-medium text-healthcare-text">{appointment.duration} minutes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pre-session Tips */}
              <div className="bg-white rounded-2xl border border-healthcare-border shadow-lg p-6">
                <h3 className="text-lg font-bold text-healthcare-text mb-4">Before You Join</h3>
                <div className="space-y-3">
                  {[
                    { icon: '🔇', text: 'Find a quiet, private space' },
                    { icon: '💡', text: 'Ensure good lighting on your face' },
                    { icon: '📝', text: 'Have your notes or topics ready' },
                    { icon: '🔋', text: 'Keep your device charged' },
                  ].map((tip, index) => (
                    <div key={index} className="flex items-center gap-3 p-2">
                      <span className="text-xl">{tip.icon}</span>
                      <span className="text-healthcare-text text-sm">{tip.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Join Button */}
              <div className="space-y-4">
                {canJoin ? (
                  <button
                    onClick={handleStartSession}
                    className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Join Session Now
                  </button>
                ) : (
                  <div className="bg-healthcare-lavender/20 border border-healthcare-lavender/30 rounded-xl p-4 text-center">
                    <svg className="w-8 h-8 text-brand-blue mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-healthcare-text font-medium mb-1">Session not available yet</p>
                    <p className="text-sm text-healthcare-text-muted">
                      You can join 15 minutes before the scheduled time
                    </p>
                  </div>
                )}
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
      <div className="min-h-screen bg-gradient-to-br from-healthcare-surface via-white to-healthcare-lavender/20 pb-20 md:pb-0">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-healthcare-border shadow-xl p-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-healthcare-text mb-2">Session Completed</h2>
              <p className="text-healthcare-text-muted">
                Session duration: {formatTime(elapsedTime)}
              </p>
            </div>

            {/* Therapist Summary */}
            <div className="flex items-center gap-4 p-4 bg-healthcare-surface rounded-xl mb-8">
              <img
                src={appointment.therapistPhoto}
                alt={appointment.therapistName}
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div>
                <p className="font-bold text-healthcare-text">{appointment.therapistName}</p>
                <p className="text-sm text-healthcare-text-muted">{appointment.specialization}</p>
              </div>
            </div>

            {/* Rating Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-healthcare-text mb-4 text-center">
                How was your session?
              </h3>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <svg
                      className={`w-10 h-10 md:w-12 md:h-12 transition-colors ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-200'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-healthcare-text-muted mb-4">
                {rating === 0 && 'Tap to rate your experience'}
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent!'}
              </p>

              <div>
                <label className="block text-sm font-semibold text-healthcare-text mb-2">
                  Share your feedback (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us about your experience..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-healthcare-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none resize-none transition-all"
                />
              </div>
            </div>

            {/* Quick Feedback Tags */}
            <div className="mb-8">
              <p className="text-sm text-healthcare-text-muted mb-3">Quick feedback:</p>
              <div className="flex flex-wrap gap-2">
                {['Professional', 'Helpful', 'Good listener', 'Comfortable environment', 'Would recommend'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setFeedback((prev) => prev ? `${prev}, ${tag}` : tag)}
                    className="px-3 py-1.5 bg-healthcare-surface hover:bg-healthcare-lavender/30 text-healthcare-text text-sm rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSubmitFeedback}
                disabled={rating === 0}
                className="w-full py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-brand-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Feedback
              </button>
              <Link
                to={`/book/${appointment.therapistId}`}
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-brand-blue text-brand-blue rounded-xl font-bold hover:bg-brand-blue hover:text-white transition-colors no-underline"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book Next Session
              </Link>
              <Link
                to="/appointments"
                className="block w-full py-3 text-center text-healthcare-text-muted hover:text-healthcare-text transition-colors no-underline font-medium"
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
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Main Video Area */}
      <div className="flex-1 relative flex">
        {/* Main Video */}
        <div className={`flex-1 relative transition-all duration-300 ${isChatOpen ? 'lg:mr-80' : ''}`}>
          {/* Remote Video (Therapist) */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            {isScreenSharing ? (
              <div className="text-center">
                <div className="inline-block p-6 bg-brand-blue/20 rounded-2xl mb-4">
                  <svg className="w-16 h-16 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-white text-lg font-medium">Screen sharing active</p>
              </div>
            ) : (
              <div className="text-center">
                <img
                  src={appointment.therapistPhoto}
                  alt={appointment.therapistName}
                  className="w-40 h-40 md:w-48 md:h-48 rounded-full mx-auto mb-6 object-cover ring-4 ring-white/20"
                />
                <p className="text-white text-xl font-semibold mb-2">{appointment.therapistName}</p>
                <p className="text-gray-400">Video consultation in progress</p>
              </div>
            )}
          </div>

          {/* Self View (Picture-in-Picture) */}
          <div className="absolute bottom-24 right-4 md:bottom-6 md:right-6 w-32 h-24 md:w-48 md:h-36 bg-gray-700 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-600">
            {isVideoOff ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-blue/50 to-healthcare-lavender/50 flex items-center justify-center">
                <p className="text-white/70 text-xs">You</p>
              </div>
            )}
            {isMuted && (
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </div>
            )}
          </div>

          {/* Top Overlay */}
          <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
            {/* Session Timer */}
            <div className="flex items-center gap-3 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white font-mono font-semibold">{formatTime(elapsedTime)}</span>
            </div>

            {/* Therapist Name */}
            <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white font-medium text-sm md:text-base">{appointment.therapistName}</span>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div
          className={`fixed lg:absolute right-0 top-0 bottom-0 w-full md:w-96 lg:w-80 bg-gray-800 border-l border-gray-700 flex flex-col transition-transform duration-300 z-20 ${
            isChatOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold">Session Chat</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-brand-blue text-white rounded-br-none'
                      : 'bg-gray-700 text-white rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-brand-blue outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center text-white hover:bg-brand-blue/80 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-3 md:px-6 md:py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mute Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`group relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
                isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMuted ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                )}
              </svg>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isMuted ? 'Unmute' : 'Mute'}
              </span>
            </button>

            {/* Video Button */}
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`group relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
                isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isVideoOff ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z M3 3l18 18" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                )}
              </svg>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isVideoOff ? 'Start Video' : 'Stop Video'}
              </span>
            </button>

            {/* Screen Share Button - Hidden on mobile */}
            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`hidden md:flex group relative w-12 h-12 rounded-full items-center justify-center transition-all ${
                isScreenSharing ? 'bg-brand-blue hover:bg-brand-blue/80' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isScreenSharing ? 'Stop Share' : 'Share Screen'}
              </span>
            </button>
          </div>

          {/* End Call Button */}
          <button
            onClick={handleEndSession}
            className="px-6 md:px-8 py-2.5 md:py-3 bg-red-600 hover:bg-red-700 rounded-full font-bold text-white transition-colors flex items-center gap-2 shadow-lg shadow-red-600/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
            </svg>
            <span className="hidden md:inline">End Session</span>
          </button>

          {/* Right Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Chat Button */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`group relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
                isChatOpen ? 'bg-brand-blue hover:bg-brand-blue/80' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Chat
              </span>
            </button>

            {/* Fullscreen Button - Hidden on mobile */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden md:flex group relative w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 items-center justify-center transition-all"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isFullscreen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0v4m0-4h4m6 0l5-5m0 0v4m0-4h-4m0 14l5 5m0 0h-4m4 0v-4m-14 4l-5-5m0 0h4m-4 0v4" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                )}
              </svg>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultation;
