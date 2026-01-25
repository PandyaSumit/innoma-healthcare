import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/layout/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AppLayout from "./components/layout/AppLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import TherapistDashboard from "./pages/TherapistDashboard";
import Appointments from "./pages/Appointments";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import TherapistDirectory from "./pages/TherapistDirectory";
import TherapistProfile from "./pages/TherapistProfile";
import BookAppointment from "./pages/BookAppointment";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import VideoConsultation from "./pages/VideoConsultation";

// Coming Soon Component
const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-10 bg-white rounded-3xl shadow-clinical border border-healthcare-border animate-fade-in text-center">
    <div className="w-20 h-20 bg-brand-blue/5 rounded-full flex items-center justify-center mb-6">
      <svg
        className="w-10 h-10 text-brand-blue animate-pulse"
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
    </div>
    <h2 className="text-3xl font-bold text-healthcare-text mb-3">{title}</h2>
    <p className="text-healthcare-text-muted max-w-md mx-auto">
      We're working hard to bring you this feature. Stay tuned for updates!
    </p>
    <div className="mt-8">
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-brand-blue text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition-all no-underline inline-block"
      >
        Back to Dashboard
      </Link>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

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
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { user } = useAuth();
  const isTherapist = user?.role === "therapist";

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <Routes>
        {/* Public Routes with Header/Footer */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <main className="flex-grow pt-24">
                <LandingPage />
              </main>
              <Footer />
            </>
          }
        />

        <Route
          path="/about"
          element={
            <>
              <Header />
              <main className="flex-grow pt-24">
                <About />
              </main>
              <Footer />
            </>
          }
        />

        <Route
          path="/privacy"
          element={
            <>
              <Header />
              <main className="flex-grow pt-24">
                <PrivacyPolicy />
              </main>
              <Footer />
            </>
          }
        />

        <Route
          path="/terms"
          element={
            <>
              <Header />
              <main className="flex-grow pt-24">
                <TermsOfService />
              </main>
              <Footer />
            </>
          }
        />

        {/* Auth Routes - No Header/Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Therapist Directory - Coming Soon */}
        <Route
          path="/therapists"
          element={
            <>
              <Header />
              <main className="flex-grow pt-24">
                <TherapistDirectory />
              </main>
              <Footer />
            </>
          }
        />

        <Route
          path="/therapists/:id"
          element={
            <>
              <Header />
              <main className="flex-grow pt-24">
                <TherapistProfile />
              </main>
              <Footer />
            </>
          }
        />

        {/* Protected Routes - Wrapped in AppLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                {isTherapist ? <TherapistDashboard /> : <Dashboard />}
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Appointments />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Support />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Booking Flow - Coming Soon */}
        <Route
          path="/book/:therapistId"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <main className="flex-grow pt-24 px-8">
                  <BookAppointment />
                </main>
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <main className="flex-grow pt-24 px-8">
                  <Checkout />
                </main>
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/confirmation"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <main className="flex-grow pt-24 px-8">
                  <Confirmation />
                </main>
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* Video Consultation - Coming Soon */}
        <Route
          path="/join/:appointmentId"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-healthcare-surface flex items-center justify-center p-8">
                <VideoConsultation />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Legacy Routes - Coming Soon */}
        <Route
          path="/assessments"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ComingSoon title="Assessments Portal" />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/sessions"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ComingSoon title="Your Sessions" />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Assessment Booking Shortcut */}
        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <Navigate to="/therapists" replace />
            </ProtectedRoute>
          }
        />
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
