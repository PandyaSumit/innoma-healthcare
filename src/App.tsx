import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import LandingPage from './pages/LandingPage';
import Footer from './components/layout/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AppLayout from './components/layout/AppLayout';

function App() {
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
        
        {/* Auth Routes - No Header/Footer (Managed by their own layouts if needed) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Member Area Routes - Wrapped in AppLayout */}
        <Route path="/dashboard" element={
          <AppLayout>
            <Dashboard />
          </AppLayout>
        } />
        <Route path="/profile" element={
          <AppLayout>
            <Profile />
          </AppLayout>
        } />
        <Route path="/assessments" element={
          <AppLayout>
            <div className="p-10 bg-white rounded-2xl shadow-clinical border border-healthcare-border">
              <h2 className="text-2xl font-bold text-healthcare-text mb-4">Assessments Portal</h2>
              <p className="text-healthcare-text-muted">No assessments pending at this time.</p>
            </div>
          </AppLayout>
        } />
        <Route path="/sessions" element={
          <AppLayout>
            <div className="p-10 bg-white rounded-2xl shadow-clinical border border-healthcare-border">
              <h2 className="text-2xl font-bold text-healthcare-text mb-4">Your Sessions</h2>
              <p className="text-healthcare-text-muted">You have no upcoming sessions. Book your first one today.</p>
            </div>
          </AppLayout>
        } />
      </Routes>
    </div>
  );
}

export default App;
