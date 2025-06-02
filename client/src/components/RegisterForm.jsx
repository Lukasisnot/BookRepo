// src/components/RegisterForm.jsx
import React, { useState } from 'react';
import { TextInput, Button, Label, Alert as FlowbiteAlert } from 'flowbite-react';
import { HiUser, HiMail, HiLockClosed, HiInformationCircle } from 'react-icons/hi';
import API from '../api'; // Assuming API is correctly configured
import { Link, useNavigate } from 'react-router-dom';

// Assuming custom themes are imported or defined above this component
import { customInputTheme, customAlertTheme } from './flowbiteCustomThemes';
// Or define them here:
// const customInputTheme = { /* ... as defined above ... */ };
// const customAlertTheme = { /* ... as defined above ... */ };

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
        setError('Name is required');
        return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/user/register', { name, email, password });
      setSuccess(response.data.message + " You can now login.");
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100 px-4 py-10 sm:py-16 flex items-center justify-center antialiased">
      <div className="w-full max-w-md bg-slate-800/70 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8">
        <h5 className="text-2xl sm:text-3xl font-bold tracking-tight text-sky-300 text-center mb-6 sm:mb-8">
          Register New Account
        </h5>
        
        {error && (
          <FlowbiteAlert
            color="failure"
            icon={HiInformationCircle}
            theme={customAlertTheme}
            className="mb-4"
          >
            <span>
              <span className="font-medium">Error!</span> {error}
            </span>
          </FlowbiteAlert>
        )}
        {success && (
          <FlowbiteAlert
            color="success"
            icon={HiInformationCircle}
            theme={customAlertTheme}
            className="mb-4"
          >
            <span>
              <span className="font-medium">Success!</span> {success}
            </span>
          </FlowbiteAlert>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name-register" value="Your name" className="text-slate-300" />
            </div>
            <TextInput
              id="name-register"
              type="text"
              icon={HiUser}
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              theme={customInputTheme}
              color="gray"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email-register" value="Your email" className="text-slate-300" />
            </div>
            <TextInput
              id="email-register"
              type="email"
              icon={HiMail}
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              theme={customInputTheme}
              color="gray"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password-register" value="Your password" className="text-slate-300" />
            </div>
            <TextInput
              id="password-register"
              type="password"
              icon={HiLockClosed}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              theme={customInputTheme}
              color="gray"
              helperText={<span className="text-slate-400 text-xs">Must be at least 6 characters.</span>} // Styled helper text
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="confirm-password" value="Confirm password" className="text-slate-300" />
            </div>
            <TextInput
              id="confirm-password"
              type="password"
              icon={HiLockClosed}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              theme={customInputTheme}
              color="gray"
            />
          </div>
          <Button
            type="submit"
            isProcessing={loading}
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-md transition-all focus:ring-4 focus:outline-none focus:ring-sky-400/50 disabled:opacity-60 disabled:saturate-50"
            color="transparent"
          >
            Register
          </Button>
          <div className="text-sm text-center text-slate-400 mt-4">
            Already registered?{' '}
            <Link to="/login" className="font-medium text-sky-400 hover:underline hover:text-sky-300">
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;