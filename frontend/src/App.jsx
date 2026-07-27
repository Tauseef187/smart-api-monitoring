import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MyApisPage from "./pages/MyApisPage";
import ApiDetailsPage from "./pages/ApiDetailsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import HistoryPage from "./pages/HistoryPage";
import AlertsPage from "./pages/AlertsPage";
import AiInsightsPage from "./pages/AiInsightsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="apis" element={<MyApisPage />} />
        <Route path="apis/:apiId" element={<ApiDetailsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="ai-insights" element={<AiInsightsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

