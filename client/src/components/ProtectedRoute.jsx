// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom'; // Added useLocation

const ProtectedRoute = ({ children }) => {
  // This basic check relies on localStorage.
  // For a more robust solution integrated with AppRoutes' state,
  // AppRoutes would need to pass down its 'user' and 'isLoading' state here too.
  // Given "no new files" and simplicity, we'll keep this as is.
  const isLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';
  const location = useLocation(); // Get current location

  if (!isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to so we can send them along after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;