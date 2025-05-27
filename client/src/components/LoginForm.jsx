import React, { useState } from 'react';
import { TextInput, Button, Label, Card, Alert } from 'flowbite-react';
import { HiMail, HiLockClosed, HiInformationCircle } from 'react-icons/hi';
import API from '../api';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  // You might want to lift this state up or use Context/Redux for a real app
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await API.post('/user/login', { email, password });
      setSuccess(response.data.message);
      setIsLoggedIn(true); // Update login state
      // Store token or user info if needed (backend sends httpOnly cookie, so frontend doesn't store token itself)
      // For example, you could store a flag in localStorage:
      localStorage.setItem('isUserLoggedIn', 'true'); 
      
      // Optionally, redirect to a dashboard or home page
      // navigate('/dashboard'); // Example redirect
      console.log("Login successful, cookie should be set by server.");
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      setIsLoggedIn(false);
      localStorage.removeItem('isUserLoggedIn');
    } finally {
      setLoading(false);
    }
  };

  // Simple logout function (for demonstration)
  const handleLogout = async () => {
    try {
      await API.get('/user/logout'); // Assuming your logout endpoint is GET /logout
      setSuccess('Logged out successfully.');
      setIsLoggedIn(false);
      localStorage.removeItem('isUserLoggedIn');
      setEmail(''); // Clear fields on logout
      setPassword('');
    } catch (err) {
      setError('Logout failed. Please try again.');
    }
  };

  if (isLoggedIn || localStorage.getItem('isUserLoggedIn') === 'true') {
    return (
      <Card className="max-w-md mx-auto mt-10 text-center">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome!
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          You are logged in.
        </p>
        {success && (
          <Alert color="success" icon={HiInformationCircle} className="mt-4">
            <span>
              <span className="font-medium">Success!</span> {success}
            </span>
          </Alert>
        )}
        <Button onClick={handleLogout} color="failure" className="mt-4">
          Logout
        </Button>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-10">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
        Login to your Account
      </h5>
      {error && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span>
            <span className="font-medium">Error!</span> {error}
          </span>
        </Alert>
      )}
      {success && !isLoggedIn && ( // Show success only if not yet redirected/showing welcome
        <Alert color="success" icon={HiInformationCircle}>
          <span>
            <span className="font-medium">Success!</span> {success}
          </span>
        </Alert>
      )}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>
        <Button type="submit" isProcessing={loading} disabled={loading}>
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