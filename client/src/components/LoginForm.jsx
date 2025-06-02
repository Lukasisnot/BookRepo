// src/components/LoginForm.jsx
import React, { useState, useEffect } from 'react';
import { TextInput, Button, Label, Alert as FlowbiteAlert } from 'flowbite-react';
import { HiMail, HiLockClosed, HiInformationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

// Assuming custom themes are imported or defined above this component
import { customInputTheme, customAlertTheme } from './flowbiteCustomThemes';
// Or define them here:
// const customInputTheme = { /* ... as defined above ... */ };
// const customAlertTheme = { /* ... as defined above ... */ };


function LoginForm({ handleLogin, authLoading, authError, clearAuthError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (authError) {
      clearAuthError();
    }
    setFormError('');
  }, [email, password, authError, clearAuthError]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!email || !password) {
      setFormError("Email and password are required.");
      return;
    }

    const result = await handleLogin(email, password);

    if (result && result.success) {
      setSuccessMessage(result.message || "Login successful! Redirecting...");
    } else if (result && result.error) {
      setFormError(result.error);
    } else if (!authError) {
      setFormError("Login failed. Please try again.");
    }
  };
  
  const displayError = formError || authError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100 px-4 py-10 sm:py-16 flex items-center justify-center antialiased">
      <div className="w-full max-w-md bg-slate-800/70 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8">
        <h5 className="text-2xl sm:text-3xl font-bold tracking-tight text-sky-300 text-center mb-6 sm:mb-8">
          Login to your Account
        </h5>
        
        {displayError && (
          <FlowbiteAlert
            color="failure"
            icon={HiInformationCircle}
            theme={customAlertTheme}
            className="mb-4" // Use customAlertTheme for styling
          >
            <span>
              <span className="font-medium">Error!</span> {displayError}
            </span>
          </FlowbiteAlert>
        )}
        {successMessage && !displayError && (
          <FlowbiteAlert
            color="success"
            icon={HiInformationCircle}
            theme={customAlertTheme}
            className="mb-4" // Use customAlertTheme for styling
          >
            <span>
              <span className="font-medium">Success!</span> {successMessage}
            </span>
          </FlowbiteAlert>
        )}

        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email-login" value="Your email" className="text-slate-300" />
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
              theme={customInputTheme}
              color="gray" // This tells Flowbite to use the 'gray' styles from our theme
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password-login" value="Your password" className="text-slate-300" />
            </div>
            <TextInput
              id="password-login"
              type="password"
              icon={HiLockClosed}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={authLoading}
              theme={customInputTheme}
              color="gray"
            />
          </div>
          <Button
            type="submit"
            isProcessing={authLoading}
            disabled={authLoading}
            className="w-full mt-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-md transition-all focus:ring-4 focus:outline-none focus:ring-sky-400/50 disabled:opacity-60 disabled:saturate-50"
            color="transparent" // Attempt to suppress default Flowbite button colors more effectively
          >
            Login
          </Button>
          <div className="text-sm text-center text-slate-400 mt-4">
            Not registered?{' '}
            <Link to="/register" className="font-medium text-sky-400 hover:underline hover:text-sky-300">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;