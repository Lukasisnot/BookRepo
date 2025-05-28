import React, { useEffect, useState } from 'react';
import { Card, Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; 
import AdminPage from '../pages/AdminPage/AdminPage';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get('/user/me');
        if (response.status === 200 && response.data.payload.role === 'admin') {
          setUser(response.data.payload);
          setIsAuthorized(true);
        } else {
          navigate('/login'); // Not admin, redirect
        }
      } catch (err) {
        navigate('/login'); // Not logged in or error occurred
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await API.get('/user/logout');
      localStorage.removeItem('isUserLoggedIn');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (!isAuthorized) {
    return null; // or a loading spinner if you want
  }

  return (
    <div>
      <AdminPage />
      <div className="flex flex-col items-center text-center mt-10">
        <h1 className="text-3xl font-bold mb-4">Logout from admin</h1>
        <Button color="failure" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Dashboard;
