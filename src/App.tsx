import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Header from "./components/layout/Header";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/layout/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AppLayout from "./components/layout/AppLayout";
import AdminLayout from "./components/layout/AdminLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
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
import ScrollToHash from "./components/layout/ScrollToHash";
import LeaderProfile from "./pages/LeaderProfile";
import HowItWorks from "./pages/HowItWorks";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Unauthorized from "./pages/Unauthorized";
import PatientProfile from "./pages/patient/Profile";
import { FullPageSpinner } from "./components/ui/Spinner";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminTherapists from "./pages/admin/Therapists";
import TherapistForm from "./pages/admin/TherapistForm";
import TherapistBookings from "./pages/admin/TherapistBookings";
import Finance from "./pages/admin/Finance";
import Articles from "./pages/admin/Articles";
import ArticleForm from "./pages/admin/ArticleForm";
import AdminSupport from "./pages/admin/Support";
import Faqs from "./pages/admin/Faqs";
import Users from "./pages/admin/Users";

// ── Query Client ──────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: 1,
    },
  },
});

// ── Coming Soon Component ─────────────────────────────────────────────────────

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

// ── Route Guards ──────────────────────────────────────────────────────────────

const ProtectedRoute = ({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullPageSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <FullPageSpinner />;
  if (isAuthenticated) {
    const home = user?.role === "admin" ? "/admin" : "/dashboard";
    return <Navigate to={home} replace />;
  }
  return <>{children}</>;
};

// ── App Routes ────────────────────────────────────────────────────────────────

function AppRoutes() {
  const { user } = useAuth();
  const isTherapist = user?.role === "therapist";

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <ScrollToHash />
      <Routes>
        {/* Public Routes with Header/Footer */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <main>
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
          path="/how-it-works"
          element={
            <>
              <Header />
              <main className="flex-grow pt-24">
                <HowItWorks />
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
        <Route
          path="/leaders/:id"
          element={
            <>
              <Header />
              <main>
                <LeaderProfile />
              </main>
              <Footer />
            </>
          }
        />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ── Admin Routes ─────────────────────────────────────────────────── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="therapists" element={<AdminTherapists />} />
          <Route path="therapists/new" element={<TherapistForm />} />
          <Route path="therapists/:id/edit" element={<TherapistForm />} />
          <Route
            path="therapists/:id/bookings"
            element={<TherapistBookings />}
          />
          <Route path="finance" element={<Finance />} />
          <Route path="articles" element={<Articles />} />
          <Route path="articles/new" element={<ArticleForm />} />
          <Route path="articles/:id/edit" element={<ArticleForm />} />
          <Route path="support" element={<AdminSupport />} />
          <Route path="faqs" element={<Faqs />} />
          <Route path="users" element={<Users />} />
        </Route>

        {/* ── Patient / Therapist Routes ─────────────────────────────────── */}
        <Route
          path="/find-therapist"
          element={
            <ProtectedRoute>
              <AppLayout>
                <TherapistDirectory />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/find-therapist/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <TherapistProfile />
              </AppLayout>
            </ProtectedRoute>
          }
        />
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
                {user?.role === "patient" ? <PatientProfile /> : <Profile />}
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
        <Route
          path="/book/:therapistId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <BookAppointment />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Checkout />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/confirmation"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Confirmation />
              </AppLayout>
            </ProtectedRoute>
          }
        />
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

// ── App ───────────────────────────────────────────────────────────────────────

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BookingProvider>
          <AppRoutes />
          <Toaster position="top-right" richColors closeButton />
        </BookingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
