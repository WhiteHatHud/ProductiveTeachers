import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, hasActiveSubscription } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireSubscription?: boolean;
  allowedRoles?: Array<"admin" | "teacher">;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireSubscription = true,
  allowedRoles,
}) => {
  const location = useLocation();
  const isLoggedIn = isAuthenticated();
  const hasSubscription = hasActiveSubscription();

  // If authentication is required and user is not logged in, redirect to login
  if (requireAuth && !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If subscription is required and user doesn't have an active subscription, redirect to payment
  if (requireAuth && requireSubscription && isLoggedIn && !hasSubscription) {
    return <Navigate to="/payment" state={{ from: location }} replace />;
  }

  // If specific roles are required, check if user has one of those roles
  if (requireAuth && isLoggedIn && allowedRoles && allowedRoles.length > 0) {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    try {
      const user = JSON.parse(userStr);
      if (!allowedRoles.includes(user.role)) {
        // User doesn't have the required role, redirect to unauthorized page or dashboard
        return (
          <Navigate to="/unauthorized" state={{ from: location }} replace />
        );
      }
    } catch (e) {
      console.error("Error parsing user data", e);
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
