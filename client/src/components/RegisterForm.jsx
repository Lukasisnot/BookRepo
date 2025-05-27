import React, { useState } from 'react';
import { TextInput, Button, Label, Card, Alert } from 'flowbite-react';
// Import HiUser for the name field icon
import { HiUser, HiMail, HiLockClosed, HiInformationCircle } from 'react-icons/hi';
import API from '../api';
import { Link, useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [name, setName] = useState(''); // <<<--- ADDED name state
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

    if (!name.trim()) { // Basic validation for name
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
      // Send name, email, and password to the backend
      const response = await API.post('/user/register', { name, email, password }); // <<<--- MODIFIED: Sending name
      // Changed path to /api/user/register based on previous discussion

      setSuccess(response.data.message + " You can now login.");
      setName(''); // Clear name field
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // Optionally navigate to login after a delay
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
    <Card className="max-w-md mx-auto mt-10">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
        Register New Account
      </h5>
      {error && (
        <Alert color="failure" icon={HiInformationCircle} className="my-4"> {/* Added margin for better spacing */}
          <span>
            <span className="font-medium">Error!</span> {error}
          </span>
        </Alert>
      )}
      {success && (
        <Alert color="success" icon={HiInformationCircle} className="my-4"> {/* Added margin */}
          <span>
            <span className="font-medium">Success!</span> {success}
          </span>
        </Alert>
      )}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div> {/* <<<--- ADDED Name Input Field Block */}
          <div className="mb-2 block">
            <Label htmlFor="name-register" value="Your name" />
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
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email-register" value="Your email" />
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
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password-register" value="Your password" />
          </div>
          <TextInput
            id="password-register"
            type="password"
            icon={HiLockClosed}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            helperText="Must be at least 6 characters." // Added helper text
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="confirm-password" value="Confirm password" />
          </div>
          <TextInput
            id="confirm-password"
            type="password"
            icon={HiLockClosed}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button type="submit" isProcessing={loading} disabled={loading}>
          Register
        </Button>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
          Already registered?{' '}
          <Link to="/login" className="text-cyan-700 hover:underline dark:text-cyan-500">
            Login here
          </Link>
        </div>
      </form>
    </Card>
  );
}

export default RegisterForm;