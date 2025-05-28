// src/components/LoginForm.jsx
import React, { useState, useEffect } from 'react';
import { TextInput, Button, Label, Card, Alert } from 'flowbite-react';
import { HiMail, HiLockClosed, HiInformationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom'; // useNavigate removed, AppRoutes will handle navigation

// Props will be passed from AppRoutes:
// handleLogin (function), authLoading (boolean), authError (string | null)
function LoginForm({ handleLogin, authLoading, authError, clearAuthError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(''); // Local form validation error
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Clear any persistent authError from AppRoutes when form fields change
    if (authError) {
      clearAuthError();
    }
    setFormError(''); // Also clear local form error
  }, [email, password, authError, clearAuthError]);


  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!email || !password) {
      setFormError("Email and password are required.");
      return;
    }

    const result = await handleLogin(email, password); // handleLogin is from AppRoutes

    if (result && result.success) {
      setSuccessMessage(result.message || "Login successful! Redirecting...");
      // Navigation is handled by AppRoutes after user state is set
    } else if (result && result.error) {
      setFormError(result.error); // Show error from login attempt
    } else if (!authError) { // Fallback if result is undefined but no authError from context
      setFormError("Login failed. Please try again.");
    }
  };
  
  // authError comes from AppRoutes, potentially from initial load or previous actions
  const displayError = formError || authError;

  return (
    <Card className="max-w-md mx-auto mt-10">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
        Login to your Account
      </h5>
      {displayError && (
        <Alert color="failure" icon={HiInformationCircle} className="mt-2">
          <span>
            <span className="font-medium">Error!</span> {displayError}
          </span>
        </Alert>
      )}
      {successMessage && !displayError && ( // Show success only if no error
        <Alert color="success" icon={HiInformationCircle} className="mt-2">
          <span>
            <span className="font-medium">Success!</span> {successMessage}
          </span>
        </Alert>
      )}
      <form className="flex flex-col gap-4 mt-4" onSubmit={onSubmit}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email-login" value="Your email" />
          </div>
          <TextInput
            id="email-login"
            type="email"
            icon={HiMail}
            placeholder="name@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={authLoading}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password-login" value="Your password" />
          </div>
          <TextInput
            id="password-login"
            type="password"
            icon={HiLockClosed}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={authLoading}
          />
        </div>
        <Button type="submit" isProcessing={authLoading} disabled={authLoading}>
          Login
        </Button>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
          Not registered?{' '}
          <Link to="/register" className="text-cyan-700 hover:underline dark:text-cyan-500">
            Create account
          </Link>
        </div>
      </form>
    </Card>
  );
}

export default LoginForm;