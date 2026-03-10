import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import ChangeCredentialsPage from "./pages/ChangeCredentialsPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import TrainersPage from "./pages/dashboard/TrainersPage";
import StudentsPage from "./pages/dashboard/StudentsPage";

const App = () => {
  const { token, user, mustChangeCredentials, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0e27" }}>
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#00d9ff", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (mustChangeCredentials && user?.role === "admin") {
    return (
      <Routes>
        <Route path="/change-credentials" element={<ChangeCredentialsPage />} />
        <Route path="*" element={<Navigate to="/change-credentials" replace />} />
      </Routes>
    );
  }

  if (mustChangeCredentials && (user?.role === "trainer" || user?.role === "student")) {
    return (
      <Routes>
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="*" element={<Navigate to="/change-password" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="trainers" element={<TrainersPage />} />
        <Route path="students" element={<StudentsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
