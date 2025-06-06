// src/components/Dashboard.jsx
import React from 'react';
import { Button, Card, Spinner } from 'flowbite-react'; // Added Spinner
import AdminPage from '../pages/AdminPage/AdminPage'; // Your admin content

// Props will be passed from AppRoutes:
// user (object | null), handleLogout (function), authLoading (boolean)
function Dashboard({ user, handleLogout, authLoading }) {

  const onLogoutClick = async () => {
    await handleLogout(); // handleLogout is from AppRoutes
  };

  // AppRoutes will handle loading state and ensuring user is an admin before rendering Dashboard
  // This component now assumes it only renders if the user is an authenticated admin.

  if (authLoading && !user) {
    // This case should ideally be handled by AppRoutes before rendering Dashboard,
    // but as a fallback:
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" aria-label="Loading dashboard..." />
      </div>
    );
  }

  // If for some reason Dashboard is rendered without a valid admin user (shouldn't happen with AppRoutes logic)
  if (!user || user.role !== 'admin') {
    return (
        <div className="flex flex-col items-center text-center mt-10">
            <p>Access Denied. You are not authorized to view this page.</p>
            <p>Redirecting...</p>
            {/* AppRoutes should ideally redirect already. This is a fallback display. */}
        </div>
    );
  }

  return (
    <div>
      {/* Pass user to AdminPage if it needs current user details */}
      <AdminPage currentUser={user} />
      
      
    </div>
  );
}

export default Dashboard;