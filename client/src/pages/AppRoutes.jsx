// src/pages/AppRoutes.jsx
import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Spinner } from 'flowbite-react';
import API from '../api'; // Your API instance

// Page Imports
import AdminContentPage from "./AdminPage/AdminPage";
import MainPage2 from "./MainPage2/MainPage2";
import About from "./About/About";

import PeriodCreateForm from "./Period/PeriodCreateForm/PeriodCreateForm";
import CreatedPeriod from "./Period/PeriodCreateForm/CreatedPeriod";
import PeriodUpdateForm from "./Period/PeriodUpdateForm/PeriodUpdateForm";
import PeriodView from "./Period/PeriodView/PeriodView"; // Ensure this component exists
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

// Component Imports
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import Dashboard from '../components/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';


function AppRoutesLogic() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchUserSession = useCallback(async () => {
    // console.log("[AppRoutesLogic] fetchUserSession called");
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await API.get('/user/me');
      // console.log("[AppRoutesLogic] /user/me response status:", response.status);
      if (response.status === 200 && response.data.payload) {
        // console.log("[AppRoutesLogic] User session fetched:", response.data.payload);
        setUser(response.data.payload);
        localStorage.setItem('isUserLoggedIn', 'true');
      } else {
        // console.log("[AppRoutesLogic] No user payload or non-200 status from /user/me");
        setUser(null);
        localStorage.removeItem('isUserLoggedIn');
      }
    } catch (err) {
      // console.error("[AppRoutesLogic] Error fetching user session:", err.response || err.message);
      setUser(null);
      localStorage.removeItem('isUserLoggedIn');
      if (err.response && err.response.status !== 401) {
        setAuthError(err.response?.data?.error || 'Failed to fetch user session.');
      }
    } finally {
      setAuthLoading(false);
      // console.log("[AppRoutesLogic] fetchUserSession finished, authLoading:", false);
    }
  }, []);

  useEffect(() => {
    fetchUserSession();
  }, [fetchUserSession]);

  const handleLogin = async (email, password) => {
    // console.log("[AppRoutesLogic] handleLogin called");
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await API.post('/user/login', { email, password });
      // console.log("[AppRoutesLogic] /user/login response status:", response.status);
      if (response.status === 200 && response.data.payload.user) {
        // console.log("[AppRoutesLogic] Login successful, user:", response.data.payload.user);
        setUser(response.data.payload.user);
        localStorage.setItem('isUserLoggedIn', 'true');
        const from = location.state?.from?.pathname || (response.data.payload.user.role === 'admin' ? '/dashboard' : '/');
        navigate(from, { replace: true });
        return { success: true, message: response.data.message || "Login successful!" };
      } else {
        throw new Error(response.data.error || 'Login failed due to unexpected response.');
      }
    } catch (err) {
      // console.error("[AppRoutesLogic] Login error:", err.response?.data?.error || err.message);
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
    // console.log("[AppRoutesLogic] handleLogout called");
    setAuthLoading(true);
    setAuthError(null);
    try {
      await API.get('/user/logout');
      // console.log("[AppRoutesLogic] /user/logout call successful");
    } catch (err) {
      console.error('[AppRoutesLogic] Logout API call failed:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('isUserLoggedIn');
      setAuthLoading(false);
      navigate('/login');
      // console.log("[AppRoutesLogic] Logout finished, user set to null");
    }
  };
  
  const clearAuthError = useCallback(() => setAuthError(null), []);

  if (authLoading && !user && !['/login', '/register'].includes(location.pathname)) {
    // console.log("[AppRoutesLogic] Displaying main app loader");
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <Spinner size="xl" aria-label="Loading application..." />
      </div>
    );
  }
  // console.log("[AppRoutesLogic] Rendering. User:", user, "AuthLoading:", authLoading);

  return (
    <>
      <Navbar 
        fluid 
        className="sticky top-0 z-50 w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 border-b-2 border-indigo-500"
      >
        <NavbarBrand as={Link} to="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold text-indigo-500 dark:text-white">
            Book Repo
          </span>
        </NavbarBrand>
        <NavbarToggle />
        <NavbarCollapse>
          <NavbarLink as={Link} to="/" className="text-indigo-500 hover:text-sky-400">Main Page</NavbarLink>
          <NavbarLink as={Link} to="/period" className="text-indigo-500 hover:text-sky-400">Periods</NavbarLink>
          <NavbarLink as={Link} to="/literary-group" className="text-indigo-500 hover:text-sky-400">Literary Groups</NavbarLink>
          <NavbarLink as={Link} to="/author" className="text-indigo-500 hover:text-sky-400">Authors</NavbarLink>
          <NavbarLink as={Link} to="/book" className="text-indigo-500 hover:text-sky-400">Books</NavbarLink>
          
          {authLoading && !user ? (
            <NavbarLink><Spinner size="sm" /></NavbarLink>
          ) : user ? (
            <>
              {user.role === 'admin' && (
                <NavbarLink as={Link} to="/dashboard" className="text-indigo-500 hover:text-sky-400">Admin Dashboard</NavbarLink>
              )}
              <NavbarLink onClick={handleLogout} style={{ cursor: 'pointer' }} className="text-indigo-500 hover:text-red-400">
                Logout ({user.name})
              </NavbarLink>
            </>
          ) : (
            <>
              <NavbarLink as={Link} to="/login" className="text-indigo-500 hover:text-sky-400">Login</NavbarLink>
              <NavbarLink as={Link} to="/register" className="text-indigo-500 hover:text-sky-400">Register</NavbarLink>
            </>
          )}
        </NavbarCollapse>
      </Navbar>

      <div className="w-full p-4">
        <Routes>
          <Route path="/" element={<MainPage2 />} />
          <Route path="/about" element={<About />} />
          
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" replace /> : <LoginForm handleLogin={handleLogin} authLoading={authLoading} authError={authError} clearAuthError={clearAuthError} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" replace /> : <RegisterForm />} 
          />
          
          <Route 
            path="/dashboard" 
            element={
              authLoading && !user ? <Spinner size="xl" /> : 
              user && user.role === 'admin' ? (
                <Dashboard user={user} handleLogout={handleLogout} authLoading={authLoading} />
              ) : user ? ( 
                <Navigate to="/" replace state={{ message: "Access Denied: Admins only." }} />
              ) : ( 
                <Navigate to="/login" state={{ from: location }} replace />
              )
            } 
          />

          {/* Period Routes */}
          <Route path="/createperiod" element={<ProtectedRoute><PeriodCreateForm /></ProtectedRoute>} />
          <Route path="/createdperiod/:id" element={<ProtectedRoute><CreatedPeriod /></ProtectedRoute>} />
          <Route path="/updateperiod/:id" element={<ProtectedRoute><PeriodUpdateForm /></ProtectedRoute>} />
          <Route path="/period/:id" element={<PeriodView user={user} />} /> {/* Passing user prop */}
          <Route path="/period" element={<PeriodList />} />

          {/* Literary Group Routes */}
          <Route path="/createliterary-group" element={<ProtectedRoute><LiteraryGroupCreateForm /></ProtectedRoute>} />
          <Route path="/createdliterary-group/:id" element={<ProtectedRoute><CreatedLiteraryGroup /></ProtectedRoute>} />
          <Route path="/updateliterary-group/:id" element={<ProtectedRoute><LiteraryGroupUpdateForm /></ProtectedRoute>} />
          <Route path="/literary-group/:id" element={<LiteraryGroupView user={user} />} />
          <Route path="/literary-group" element={<LiteraryGroupList />} />

          {/* Author Routes */}
          <Route path="/createauthor" element={<ProtectedRoute><AuthorCreateForm /></ProtectedRoute>} />
          <Route path="/createdauthor/:id" element={<ProtectedRoute><CreatedAuthor /></ProtectedRoute>} />
          <Route path="/updateauthor/:id" element={<ProtectedRoute><AuthorUpdateForm /></ProtectedRoute>} />
          <Route path="/author/:id" element={<AuthorView user={user} />} />
          <Route path="/author" element={<AuthorList />} />

          {/* Book Routes */}
          <Route path="/createbook" element={<ProtectedRoute><BookCreateForm /></ProtectedRoute>} />
          <Route path="/createdbook/:id" element={<ProtectedRoute><CreatedBook /></ProtectedRoute>} />
          <Route path="/updatebook/:id" element={<ProtectedRoute><BookUpdateForm /></ProtectedRoute>} />
          <Route path="/book/:id" element={<BookView user={user} />} />
          <Route path="/book" element={<BookList />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppRoutesLogic />
    </BrowserRouter>
  );
}