import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import TeamLogin from './pages/TeamLogin';
import AdminLogin from './pages/AdminLogin';
import TeamDashboard from './pages/TeamDashboard';
import ClueDisplay from './pages/ClueDisplay';
import CodeSubmit from './pages/CodeSubmit';
import PhotoUpload from './pages/PhotoUpload';
import RoundCompletion from './pages/RoundCompletion';
import EliminationNotice from './pages/EliminationNotice';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Navigate to="/team/login" replace />} />
            <Route path="/team/login" element={<TeamLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route
              path="/team/dashboard"
              element={
                <ProtectedRoute type="team">
                  <TeamDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team/clue"
              element={
                <ProtectedRoute type="team">
                  <ClueDisplay />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team/code"
              element={
                <ProtectedRoute type="team">
                  <CodeSubmit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team/photo"
              element={
                <ProtectedRoute type="team">
                  <PhotoUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team/round-complete"
              element={
                <ProtectedRoute type="team">
                  <RoundCompletion />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team/eliminated"
              element={
                <ProtectedRoute type="team">
                  <EliminationNotice />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute type="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

