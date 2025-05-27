import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user is logged in (e.g., from localStorage or context)
  const isLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';

  if (!isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to so we can send them along after they login.
    // For simplicity, we're just redirecting to login.
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;