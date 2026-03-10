import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import ChangeCredentialsPage from "./pages/ChangeCredentialsPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

const App = () => {
  const { token, user, mustChangeCredentials, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // not logged in → login page
  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // logged in but must change credentials (admin first login)
  if (mustChangeCredentials && user?.role === "admin") {
    return (
      <Routes>
        <Route path="/change-credentials" element={<ChangeCredentialsPage />} />
        <Route path="*" element={<Navigate to="/change-credentials" replace />} />
      </Routes>
    );
  }

  // logged in but must change password (trainer/student first login)
  if (mustChangeCredentials && (user?.role === "trainer" || user?.role === "student")) {
    return (
      <Routes>
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="*" element={<Navigate to="/change-password" replace />} />
      </Routes>
    );
  }

  // fully authenticated → redirect to dashboard (we'll build this later)
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;