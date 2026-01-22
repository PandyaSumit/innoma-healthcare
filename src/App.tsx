import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import LandingPage from './pages/LandingPage';
import Footer from './components/layout/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AppLayout from './components/layout/AppLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import TherapistDirectory from './pages/TherapistDirectory';
import TherapistProfile from './pages/TherapistProfile';
import BookAppointment from './pages/BookAppointment';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import Appointments from './pages/Appointments';
import VideoConsultation from './pages/VideoConsultation';
import Support from './pages/Support';
import Settings from './pages/Settings';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import TherapistDashboard from './pages/TherapistDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-healthcare-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { user } = useAuth();
  const isTherapist = user?.role === 'therapist';

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <Routes>
        {/* Public Routes with Header/Footer */}
        <Route path="/" element={
          <>
            <Header />
            <main className="flex-grow pt-24">
              <LandingPage />
            </main>
            <Footer />
          </>
        } />

        <Route path="/about" element={
          <>
            <Header />
            <main className="flex-grow pt-24">
              <About />
            </main>
            <Footer />
          </>
        } />

        <Route path="/privacy" element={
          <>
            <Header />
            <main className="flex-grow pt-24">
              <PrivacyPolicy />
            </main>
            <Footer />
          </>
        } />

        <Route path="/terms" element={
          <>
            <Header />
            <main className="flex-grow pt-24">
              <TermsOfService />
            </main>
            <Footer />
          </>
        } />

        {/* Auth Routes - No Header/Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Therapist Directory - Public */}
        <Route path="/therapists" element={
          <>
            <Header />
            <main className="flex-grow pt-24">
              <TherapistDirectory />
            </main>
            <Footer />
          </>
        } />

        <Route path="/therapists/:id" element={
          <>
            <Header />
            <main className="flex-grow pt-24">
              <TherapistProfile />
            </main>
            <Footer />
          </>
        } />

        {/* Protected Routes - Wrapped in AppLayout */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout>
              {isTherapist ? <TherapistDashboard /> : <Dashboard />}
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/appointments" element={
          <ProtectedRoute>
            <AppLayout>
              <Appointments />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/support" element={
          <ProtectedRoute>
            <AppLayout>
              <Support />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Booking Flow - Protected */}
        <Route path="/book/:therapistId" element={
          <ProtectedRoute>
            <>
              <Header />
              <main className="flex-grow pt-24">
                <BookAppointment />
              </main>
            </>
          </ProtectedRoute>
        } />

        <Route path="/checkout" element={
          <ProtectedRoute>
            <>
              <Header />
              <main className="flex-grow pt-24">
                <Checkout />
              </main>
            </>
          </ProtectedRoute>
        } />

        <Route path="/confirmation" element={
          <ProtectedRoute>
            <>
              <Header />
              <main className="flex-grow pt-24">
                <Confirmation />
              </main>
            </>
          </ProtectedRoute>
        } />

        {/* Video Consultation - Full Screen */}
        <Route path="/join/:appointmentId" element={
          <ProtectedRoute>
            <VideoConsultation />
          </ProtectedRoute>
        } />

        {/* Legacy Routes */}
        <Route path="/assessments" element={
          <ProtectedRoute>
            <AppLayout>
              <div className="p-10 bg-white rounded-2xl shadow-clinical border border-healthcare-border">
                <h2 className="text-2xl font-bold text-healthcare-text mb-4">Assessments Portal</h2>
                <p className="text-healthcare-text-muted">Book your free assessment from the therapist directory.</p>
              </div>
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/sessions" element={
          <ProtectedRoute>
            <AppLayout>
              <div className="p-10 bg-white rounded-2xl shadow-clinical border border-healthcare-border">
                <h2 className="text-2xl font-bold text-healthcare-text mb-4">Your Sessions</h2>
                <p className="text-healthcare-text-muted">View all your sessions in the Appointments page.</p>
              </div>
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Assessment Booking Shortcut */}
        <Route path="/assessment" element={
          <ProtectedRoute>
            <Navigate to="/therapists" replace />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
