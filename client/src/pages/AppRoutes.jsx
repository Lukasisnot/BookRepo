// src/pages/AppRoutes.jsx
import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Spinner } from 'flowbite-react';
import API from '../api'; // Your API instance

// Your Page/Component Imports
import AdminContentPage from "./AdminPage/AdminPage"; // Renamed MainPage to AdminContentPage for clarity
import MainPage2 from "./MainPage2/MainPage2";
import About from "./About/About";
// ... other page imports ...
import PeriodCreateForm from "./Period/PeriodCreateForm/PeriodCreateForm";
import CreatedPeriod from "./Period/PeriodCreateForm/CreatedPeriod";
import PeriodUpdateForm from "./Period/PeriodUpdateForm/PeriodUpdateForm";
import PeriodView from "./Period/PeriodView/PeriodView";
import PeriodList from "./Period/PeriodList/PeriodList";

import LiteraryGroupCreateForm from "./LiteraryGroup/LiteraryGroupCreateForm/LiteraryGroupCreateForm";
import CreatedLiteraryGroup from "./LiteraryGroup/LiteraryGroupCreateForm/CreatedLiteraryGroup";
import LiteraryGroupUpdateForm from "./LiteraryGroup/LiteraryGroupUpdateForm/LiteraryGroupUpdateForm";
import LiteraryGroupView from "./LiteraryGroup/LiteraryGroupView/LiteraryGroupView";
import LiteraryGroupList from "./LiteraryGroup/LiteraryGroupList/LiteraryGroupList";

import AuthorCreateForm from "./Author/AuthorCreateForm/AuthorCreateForm";
import CreatedAuthor from "./Author/AuthorCreateForm/CreatedAuthor";
import AuthorUpdateForm from "./Author/AuthorUpdateForm/AuthorUpdateForm";
import AuthorView from "./Author/AuthorView/AuthorView";
import AuthorList from "./Author/AuthorList/AuthorList";

import BookCreateForm from "./Book/BookCreateForm/BookCreateForm";
import CreatedBook from "./Book/BookCreateForm/CreatedBook";
import BookView from "./Book/BookView/BookView";
import BookUpdateForm from "./Book/BookUpdateForm/BookUpdateForm";
import BookList from "./Book/BookList/BookList";

// Auth Components
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm'; // Assuming you have this
import Dashboard from '../components/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';


// Wrapper component to use hooks like useNavigate within AppRoutes logic
function AppRoutesLogic() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // Start true for initial check
  const [authError, setAuthError] = useState(null);

  const fetchUserSession = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await API.get('/user/me'); // API should handle cookies
      if (response.status === 200 && response.data.payload) {
        setUser(response.data.payload);
        localStorage.setItem('isUserLoggedIn', 'true'); // Sync localStorage
      } else {
        setUser(null);
        localStorage.removeItem('isUserLoggedIn');
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('isUserLoggedIn');
      if (err.response && err.response.status !== 401) { // Don't show error for normal "not logged in"
        setAuthError(err.response?.data?.error || 'Failed to fetch user session.');
      }
      console.log('No active session or error fetching user:', err.message);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserSession();
  }, [fetchUserSession]);

  const handleLogin = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await API.post('/user/login', { email, password });
      if (response.status === 200 && response.data.payload.user) {
        setUser(response.data.payload.user);
        localStorage.setItem('isUserLoggedIn', 'true');
        
        const from = location.state?.from?.pathname || (response.data.payload.user.role === 'admin' ? '/dashboard' : '/');
        navigate(from, { replace: true });
        return { success: true, message: response.data.message || "Login successful!" };
      } else {
        throw new Error(response.data.error || 'Login failed.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed.';
      setAuthError(errorMessage);
      setUser(null);
      localStorage.removeItem('isUserLoggedIn');
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await API.get('/user/logout');
    } catch (err) {
      console.error('Logout API call failed:', err);
      // Still proceed with frontend logout
    } finally {
      setUser(null);
      localStorage.removeItem('isUserLoggedIn');
      setAuthLoading(false);
      navigate('/login');
    }
  };
  
  const clearAuthError = useCallback(() => setAuthError(null), []);

  // Early exit for loading state to prevent rendering routes prematurely
  if (authLoading && !user) { // Show global spinner if still loading initial session
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" aria-label="Loading application..." />
      </div>
    );
  }

  return (
    <>
      <Navbar fluid rounded className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 border-b-2 border-indigo-500">
        <NavbarBrand as={Link} to="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white text-indigo-500">
            Book Repo
          </span>
        </NavbarBrand>
        <NavbarToggle />
        <NavbarCollapse>
          <NavbarLink as={Link} to="/" className="text-indigo-500">Main Page</NavbarLink>
          <NavbarLink as={Link} to="/about" className="text-indigo-500">About</NavbarLink>
          <NavbarLink as={Link} to="/period" className="text-indigo-500">Periods</NavbarLink>
          <NavbarLink as={Link} to="/literary-group" className="text-indigo-500">Literary Groups</NavbarLink>
          <NavbarLink as={Link} to="/author" className="text-indigo-500">Authors</NavbarLink>
          
          
          {authLoading ? (
            <NavbarLink><Spinner size="sm" /></NavbarLink>
          ) : user ? (
            <>
              {user.role === 'admin' && (
                <NavbarLink as={Link} to="/dashboard">Admin Dashboard</NavbarLink>
              )}
              <NavbarLink onClick={handleLogout} style={{ cursor: 'pointer' }} className="text-indigo-500">
                Logout ({user.name})
              </NavbarLink>
            </>
          ) : (
            <>
              <NavbarLink as={Link} to="/login" className="text-indigo-500">Login</NavbarLink>
              <NavbarLink as={Link} to="/register" className="text-indigo-500">Register</NavbarLink>
            </>
          )}
        </NavbarCollapse>
      </Navbar>

      <div className="w-full p-4">
        <Routes>
          <Route path="/" element={<MainPage2 />} />
          <Route path="/about" element={<About />} />
          
          {/* Auth Routes */}
          {/* Redirect if user is already logged in */}
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginForm handleLogin={handleLogin} authLoading={authLoading} authError={authError} clearAuthError={clearAuthError} />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterForm />} /> {/* Assuming RegisterForm exists and might need similar props */}
          
          {/* Protected Dashboard Route for Admins */}
          <Route 
            path="/dashboard" 
            element={
              authLoading ? <Spinner size="xl" /> : // Show spinner while auth state resolves
              user && user.role === 'admin' ? (
                <Dashboard user={user} handleLogout={handleLogout} authLoading={authLoading} />
              ) : user ? ( // Logged in but not admin
                <Navigate to="/" replace state={{ message: "Access Denied: Admins only." }} />
              ) : ( // Not logged in
                <Navigate to="/login" state={{ from: location }} replace />
              )
            } 
          />

          {/* Example of what was previously "/admin", now maybe an Admin Content Page also admin-protected */}
          {/* <Route path="/admin-content" element={ authLoading ? <Spinner /> : user && user.role === 'admin' ? <AdminContentPage /> : <Navigate to={user ? "/" : "/login"} />} /> */}


          {/* CRUD Routes - using basic ProtectedRoute (localStorage check) */}
          {/* If these also need to be admin-only, apply similar logic as /dashboard */}
          <Route path="/createperiod" element={<ProtectedRoute><PeriodCreateForm /></ProtectedRoute>} />
          <Route path="/createdperiod/:id" element={<ProtectedRoute><CreatedPeriod /></ProtectedRoute>} />
          <Route path="/updateperiod/:id" element={<ProtectedRoute><PeriodUpdateForm /></ProtectedRoute>} />
          <Route path="/period/:id" element={<PeriodView />} />
          <Route path="/period" element={<PeriodList />} />

          {/* ... other CRUD routes ... (Apply ProtectedRoute or admin-specific logic as needed) */}
          <Route path="/createliterary-group" element={<ProtectedRoute><LiteraryGroupCreateForm /></ProtectedRoute>} />
          <Route path="/createdliterary-group/:id" element={<ProtectedRoute><CreatedLiteraryGroup /></ProtectedRoute>} />
          <Route path="/updateliterary-group/:id" element={<ProtectedRoute><LiteraryGroupUpdateForm /></ProtectedRoute>} />
          <Route path="/literary-group/:id" element={<LiteraryGroupView />} />
          <Route path="/literary-group" element={<LiteraryGroupList />} />

          <Route path="/createauthor" element={<ProtectedRoute><AuthorCreateForm /></ProtectedRoute>} />
          <Route path="/createdauthor/:id" element={<ProtectedRoute><CreatedAuthor /></ProtectedRoute>} />
          <Route path="/updateauthor/:id" element={<ProtectedRoute><AuthorUpdateForm /></ProtectedRoute>} />
          <Route path="/author/:id" element={<AuthorView />} />
          <Route path="/author" element={<AuthorList />} />

          <Route path="/createbook" element={<ProtectedRoute><BookCreateForm /></ProtectedRoute>} />
          <Route path="/createdbook/:id" element={<ProtectedRoute><CreatedBook /></ProtectedRoute>} />
          <Route path="/updatebook/:id" element={<ProtectedRoute><BookUpdateForm /></ProtectedRoute>} />
          <Route path="/book/:id" element={<BookView />} />
          <Route path="/book" element={<BookList />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

// Main export that wraps AppRoutesLogic with BrowserRouter
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppRoutesLogic />
    </BrowserRouter>
  );
}