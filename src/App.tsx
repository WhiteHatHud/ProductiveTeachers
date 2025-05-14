import { Suspense, useEffect } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import PaymentPage from "./components/PaymentPage";
import DataSecurityPrivacyPage from "./components/DataSecurityPrivacyPage";
import UnauthorizedPage from "./components/UnauthorizedPage";
import ProtectedRoute from "./components/ProtectedRoute";
import routes from "tempo-routes";
import { isAuthenticated } from "./lib/auth";

function App() {
  // Check authentication status on app load
  useEffect(() => {
    // You could add additional initialization logic here
  }, []);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/data-security" element={<DataSecurityPrivacyPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute requireSubscription={false}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect to login if not authenticated, otherwise to dashboard */}
          <Route
            path="*"
            element={
              isAuthenticated() ? <Navigate to="/" /> : <Navigate to="/login" />
            }
          />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
