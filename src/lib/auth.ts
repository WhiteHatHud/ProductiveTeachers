// Simple authentication utility functions

export interface User {
  email: string;
  name: string;
  role: "admin" | "teacher";
  subscriptionPlan?: string;
  subscriptionActive?: boolean;
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const user = localStorage.getItem("user");
  return !!user;
};

// Get current user
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as User;
  } catch (e) {
    console.error("Error parsing user data", e);
    return null;
  }
};

// Check if user has a specific role
export const hasRole = (role: "admin" | "teacher"): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  return user.role === role;
};

// Check if user is admin
export const isAdmin = (): boolean => {
  return hasRole("admin");
};

// Check if user is teacher
export const isTeacher = (): boolean => {
  return hasRole("teacher");
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// Check if user has active subscription
export const hasActiveSubscription = (): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  return !!user.subscriptionActive;
};
